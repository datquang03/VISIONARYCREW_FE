  import React, { createContext, useState } from 'react';

  // eslint-disable-next-line react-refresh/only-export-components
  export const SidebarContext = createContext();

  export const SidebarProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
        {children}
      </SidebarContext.Provider>
    );
  };