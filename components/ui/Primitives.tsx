import React from 'react';

export const Button = ({ className = '', variant = 'default', size, ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-emerald-600 underline-offset-4 hover:underline",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  // @ts-ignore
  return <button className={`${baseStyle} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`} {...props} />;
};

export const Input = ({ className = '', ...props }: any) => (
  <input className={`flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

export const Label = ({ className = '', ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
);

export const Textarea = ({ className = '', ...props }: any) => (
  <textarea className={`flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

export const Badge = ({ className = '', variant = "default", ...props }: any) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${className}`} {...props} />
);

export const Avatar = ({ className = '', ...props }: any) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />
);

export const AvatarImage = ({ className = '', src, ...props }: any) => (
    src ? <img className={`aspect-square h-full w-full ${className}`} src={src} {...props} /> : null
);

export const AvatarFallback = ({ className = '', children, ...props }: any) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`} {...props}>{children}</div>
);

export const Select = ({ children, value, onValueChange }: any) => {
    return <div className="relative">{React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, { value, onValueChange });
        }
        return child;
    })}</div>;
};

export const SelectTrigger = ({ className = '', children, ...props }: any) => (
  <button className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>
);

export const SelectValue = ({ placeholder, ...props }: any) => (
  <span className="block truncate">{placeholder || "Select..."}</span>
);

export const SelectContent = ({ children, ...props }: any) => (
   <div className="absolute top-full z-50 mt-1 max-h-96 w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80" {...props}>
     <div className="p-1">{children}</div>
   </div>
);

export const SelectItem = ({ className = '', children, value, onValueChange, ...props }: any) => {
    return (
        <div 
            className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 cursor-pointer ${className}`} 
            onClick={() => {
                if (props.onClick) props.onClick();
            }}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"></span>
            <span className="truncate">{children}</span>
        </div>
    );
};

export const Tabs = ({ className = '', defaultValue, children }: any) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);
    return (
        <div className={className}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { activeTab, setActiveTab });
                }
                return child;
            })}
        </div>
    );
};

export const TabsList = ({ className = '', children, activeTab, setActiveTab }: any) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 ${className}`}>
      {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
             // @ts-ignore
             return React.cloneElement(child, { activeTab, setActiveTab });
          }
          return child;
      })}
  </div>
);

export const TabsTrigger = ({ className = '', value, children, activeTab, setActiveTab }: any) => (
  <button 
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 ${activeTab === value ? 'bg-white text-gray-950 shadow-sm' : ''} ${className}`}
    onClick={() => setActiveTab && setActiveTab(value)}
  >
      {children}
  </button>
);

export const TabsContent = ({ className = '', value, children, activeTab }: any) => {
    if (value !== activeTab) return null;
    return <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}>{children}</div>;
};

export const Switch = ({ className = '', checked, onCheckedChange, ...props }: any) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
        className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-emerald-600' : 'bg-gray-200'} ${className}`}
        {...props}
    >
        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

export const Popover = ({ children }: any) => <div className="relative inline-block w-full">{children}</div>;
export const PopoverTrigger = ({ asChild, children, ...props }: any) => React.cloneElement(children, props);
export const PopoverContent = ({ className = '', children }: any) => <div className={`absolute z-50 w-full rounded-md border border-gray-200 bg-white p-4 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 mt-2 ${className}`}>{children}</div>;

export const Calendar = ({ mode, selected, onSelect, className = '', ...props }: any) => {
  if (mode === 'range') {
    return (
      <div className={`p-4 bg-white space-y-4 ${className}`}>
        <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
               <input 
                 type="date" 
                 className="w-full p-2 border rounded-md text-sm"
                 value={selected?.from ? selected.from.toISOString().split('T')[0] : ''}
                 onChange={(e) => onSelect({...selected, from: e.target.value ? new Date(e.target.value) : undefined})}
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
               <input 
                 type="date" 
                 className="w-full p-2 border rounded-md text-sm"
                 value={selected?.to ? selected.to.toISOString().split('T')[0] : ''}
                 min={selected?.from ? selected.from.toISOString().split('T')[0] : ''}
                 onChange={(e) => onSelect({...selected, to: e.target.value ? new Date(e.target.value) : undefined})}
               />
            </div>
        </div>
        <p className="text-xs text-gray-400 text-center">Select your rental period</p>
      </div>
    );
  }
  return <div className={`p-3 bg-white border rounded-lg ${className}`}>Calendar Mock</div>;
};