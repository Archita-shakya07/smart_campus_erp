import React, { useState } from "react";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: "",
  setActiveTab: () => {},
});

export const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children, ...props }: TabsListProps) => (
  <div
    className={`flex gap-2 border-b border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, ...props }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
        activeTab === value
          ? "border-teal-700 text-teal-700"
          : "border-transparent text-gray-600 hover:text-gray-800"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, ...props }: TabsContentProps) => {
  const { activeTab } = React.useContext(TabsContext);

  return activeTab === value ? <div {...props}>{children}</div> : null;
};