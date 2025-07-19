import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab, ProductCard, Button, Loader, Badge } from './components';
import { ProductInfo } from './utils/productExtractor';
import './styles.css';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

interface ImportState {
  product: ProductInfo | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('import');
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });
  const [importState, setImportState] = useState<ImportState>({
    product: null,
    loading: false,
    error: null,
    success: false
  });
  const [recentImports, setRecentImports] = useState<ProductInfo[]>([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    chrome.runtime.sendMessage({ type: 'CHECK_AUTH' }, (response) => {
      setAuth({
        isAuthenticated: response.isAuthenticated,
        user: response.user,
        loading: false
      });
    });
    
    // Load recent imports
    chrome.storage.local.get('recentImports', (data) => {
      if (data.recentImports) {
        setRecentImports(data.recentImports);
      }
    });
    
    // Extract product from current page
    extractCurrentProduct();
  }, []);

  const extractCurrentProduct = () => {
    setImportState({ ...importState, loading: true, error: null });
    
    chrome.runtime.sendMessage({ type: 'EXTRACT_PRODUCT' }, (product) => {
      if (product) {
        setImportState({
          product,
          loading: false,
          error: null,
          success: false
        });
      } else {
        setImportState({
          product: null,
          loading: false,
          error: 'Aucun produit détecté sur cette page',
          success: false
        });
      }
    });
  };

  const handleImport = () => {
    if (!importState.product) return;
    
    setImportState({ ...importState, loading: true, error: null });
    
    chrome.runtime.sendMessage(
      { type: 'IMPORT_PRODUCT', data: importState.product },
      (response) => {
        if (response.success) {
          // Add to recent imports
          const updatedImports = [importState.product, ...recentImports].slice(0, 10);
          chrome.storage.local.set({ recentImports: updatedImports });
          setRecentImports(updatedImports);
          
          setImportState({
            ...importState,
            loading: false,
            success: true,
            error: null
          });
        } else {
          setImportState({
            ...importState,
            loading: false,
            success: false,
            error: response.error || 'Erreur lors de l\'import'
          });
        }
      }
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    chrome.runtime.sendMessage(
      { type: 'LOGIN', data: loginForm },
      (response) => {
        if (response.success) {
          setAuth({
            isAuthenticated: true,
            user: response.user,
            loading: false
          });
        } else {
          setLoginError(response.error || 'Erreur de connexion');
        }
      }
    );
  };

  const handleLogout = () => {
    chrome.runtime.sendMessage({ type: 'LOGOUT' }, () => {
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    });
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: 'https://app.dropflow.pro/dashboard' });
  };

  const renderAuthContent = () => {
    if (auth.loading) {
      return <Loader />;
    }
    
    if (!auth.isAuthenticated) {
      return (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </div>
          {loginError && <div className="text-error mb-2">{loginError}</div>}
          <Button type="submit" variant="primary" className="btn-block">Se connecter</Button>
          <div className="text-center mt-2">
            <a href="https://app.dropflow.pro/register" target="_blank" className="text-primary">Créer un compte</a>
          </div>
        </form>
      );
    }
    
    return (
      <div>
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="card-title">Bonjour, {auth.user?.name || auth.user?.email}</div>
              <div className="card-subtitle">Plan {auth.user?.subscription || 'Gratuit'}</div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
        
        <div className="form-group">
          <Button variant="primary" className="btn-block" onClick={openDashboard}>
            Ouvrir le Dashboard
          </Button>
        </div>
        
        <div className="card">
          <div className="card-title">Statistiques</div>
          <div className="flex justify-between mt-2">
            <div className="text-center">
              <div className="text-primary font-bold">{auth.user?.stats?.products || 0}</div>
              <div className="text-sm">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-bold">{auth.user?.stats?.imports || 0}</div>
              <div className="text-sm">Imports</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-bold">{auth.user?.stats?.orders || 0}</div>
              <div className="text-sm">Commandes</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderImportContent = () => {
    if (importState.loading) {
      return <Loader />;
    }
    
    if (importState.error) {
      return (
        <div className="card">
          <div className="text-error">{importState.error}</div>
          <Button 
            variant="secondary" 
            className="mt-2" 
            onClick={extractCurrentProduct}
          >
            Réessayer
          </Button>
        </div>
      );
    }
    
    if (importState.success) {
      return (
        <div className="card">
          <div className="text-success mb-2">Produit importé avec succès !</div>
          <ProductCard product={importState.product!} />
          <div className="flex gap-2 mt-2">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={extractCurrentProduct}
            >
              Importer un autre
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={openDashboard}
            >
              Voir dans DropFlow
            </Button>
          </div>
        </div>
      );
    }
    
    if (importState.product) {
      return (
        <div className="card">
          <ProductCard product={importState.product} />
          <Button 
            variant="primary" 
            className="btn-block mt-2" 
            onClick={handleImport}
            disabled={!auth.isAuthenticated}
          >
            {auth.isAuthenticated ? 'Importer ce produit' : 'Connectez-vous pour importer'}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="card">
        <div className="text-center">
          <div className="mb-2">Naviguez vers une page produit pour l'importer</div>
          <div className="text-sm text-gray-500 mb-2">Sites supportés :</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="info">AliExpress</Badge>
            <Badge variant="info">BigBuy</Badge>
            <Badge variant="info">Amazon</Badge>
            <Badge variant="info">Cdiscount</Badge>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryContent = () => {
    if (recentImports.length === 0) {
      return (
        <div className="card">
          <div className="text-center">
            <div className="mb-2">Aucun produit importé récemment</div>
            <div className="text-sm text-gray-500">
              Les produits que vous importez apparaîtront ici
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        {recentImports.map((product, index) => (
          <div className="card" key={index}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="header">
        <img src="icons/icon48.png" alt="DropFlow Pro" className="header-logo" />
        <div className="header-title">DropFlow Pro</div>
      </div>
      
      <div className="container">
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <Tab id="import" label="Import">
            {renderImportContent()}
          </Tab>
          <Tab id="history" label="Historique">
            {renderHistoryContent()}
          </Tab>
          <Tab id="account" label="Compte">
            {renderAuthContent()}
          </Tab>
        </Tabs>
      </div>
      
      <div className="footer">
        DropFlow Pro v2.0.0 © 2024
      </div>
    </div>
  );
};
