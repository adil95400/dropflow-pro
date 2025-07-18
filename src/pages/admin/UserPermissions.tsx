import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export const UserPermissionsPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/user-permissions')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const updatePermissions = () => {
    fetch('/api/admin/user-permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users),
    }).then(() => alert('✅ Permissions mises à jour !'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔐 Droits d’import par utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>📦 Produit</th>
              <th>⭐ Avis</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.email}</td>
                <td><Switch checked={u.can_import_product} onCheckedChange={(v) => {
                  const newUsers = [...users];
                  newUsers[i].can_import_product = v;
                  setUsers(newUsers);
                }} /></td>
                <td><Switch checked={u.can_import_reviews} onCheckedChange={(v) => {
                  const newUsers = [...users];
                  newUsers[i].can_import_reviews = v;
                  setUsers(newUsers);
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button className="mt-4" onClick={updatePermissions}>💾 Sauvegarder</Button>
      </CardContent>
    </Card>
  );
};