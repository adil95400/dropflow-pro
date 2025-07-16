import React from 'react';

interface TabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children }) => {
  // Filter out non-Tab children
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.props.id && child.props.label
  );

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab) => {
          const { id, label } = (tab as React.ReactElement).props;
          return (
            <div
              key={id}
              className={`tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => onChange(id)}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="tab-content-container">
        {tabs.map((tab) => {
          const { id, children } = (tab as React.ReactElement).props;
          return (
            <div
              key={id}
              className={`tab-content ${activeTab === id ? 'active' : ''}`}
            >
              {children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;