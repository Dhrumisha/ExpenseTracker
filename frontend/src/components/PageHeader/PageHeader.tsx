"use client";

export interface PageHeaderProps {
  title?: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {

  return (
    <div className="px-4 flex flex-col">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm md:text-base text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
