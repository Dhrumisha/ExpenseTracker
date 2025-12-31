// "use client";

// import type { ReactNode } from "react";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import { Plus, ArrowLeft } from "lucide-react";

// import { Breadcrumb } from "@/components/Breadcrumb/Breadcrumb";
// import ButtonWithProps from "@/components/Button/Button";
// import { useAppSelector } from "@/redux";
// import type { CompanyModules, ModuleItem } from "@/types/common/redux/module-slice.types";

// interface PageHeaderProps {
//   customModuleName?: string;
//   customDescription?: string;
//   isModel?: boolean;
//   onClick?: () => void;
//   isBreadcrumb?: boolean;
//   showBackButton?: boolean;
//   navigateUrl?: string;
//   buttonName?: string;
//   children?: ReactNode;
//   className?: string;
//   usedInsideSection?: boolean;
// }

// export const PageHeader = ({
//   customModuleName,
//   customDescription,
//   isModel = false,
//   onClick,
//   isBreadcrumb = true,
//   showBackButton = false,
//   navigateUrl,
//   buttonName,
//   children,
//   className,
//   usedInsideSection = false,
// }: PageHeaderProps) => {
//   const pathname = usePathname();
//   const modules = useAppSelector((state) => state.modules.modules);

//   // Show action panel only if user has edit/delete permissions or is super user
//   // View-only users should NOT see the action panel

//   // Guard against undefined modules
//   if (!modules || Object.keys(modules).length === 0) {
//     return null;
//   }

//   // Recursive function to find module by path_url in nested structure
//   const findModuleByPath = (
//     modulesToSearch: CompanyModules,
//     path: string
//   ): [string, ModuleItem] | null => {
//     for (const [key, value] of Object.entries(modulesToSearch)) {
//       // Check if value exists and has path_url
//       if (value?.path_url != null && value.path_url === path) {
//         return [key, value];
//       }

//       // Recursively search in children
//       if (value?.children) {
//         const found = findModuleByPath(value.children, path);
//         if (found) {
//           return found;
//         }
//       }
//     }
//     return null;
//   };

//   const currentModule = findModuleByPath(modules, pathname);

//   if (!currentModule) {
//     return null;
//   }

//   const [moduleName, moduleData] = currentModule;

//   const moduleTitle = customModuleName ? customModuleName : moduleName;
//   const moduleDescription = customDescription ? customDescription : moduleData?.module_description;

//   // Guard against undefined moduleData
//   if (!moduleData) {
//     return null;
//   }

//   return (
//     <div
//       className={`px-8 flex flex-col gap-4 ${className ?? ""} ${
//         usedInsideSection ? "py-0" : "lg:pt-6 pt-4"
//       }`}
//     >
//       {/* Breadcrumbs */}
//       <div>{isBreadcrumb && <Breadcrumb />}</div>

//       {/* Heading and Description */}
//       <div className="w-full flex lg:flex-row flex-col items-center sm:justify-between justify-end gap-4 leading-10!">
//         <div className="flex max-lg:w-full items-center gap-2 mb-4 md:mb-6 lg:mb-0">
//           {showBackButton && navigateUrl && (
//             <Link href={navigateUrl} prefetch={false}>
//               <ButtonWithProps
//                 type="button"
//                 variant="ghost"
//                 size="default"
//                 aria-label="Back"
//                 icon={<ArrowLeft className="h-4 w-4" />}
//               >
//                 Back
//               </ButtonWithProps>
//             </Link>
//           )}
//           <div>
//             <h1 id={moduleTitle} className="text-xl md:text-2xl font-bold text-foreground">
//               {moduleTitle}
//             </h1>
//             {moduleDescription && (
//               <p className="text-sm md:text-base text-muted-foreground mt-1">{moduleDescription}</p>
//             )}
//           </div>
//         </div>

//         <div
//           className="flex max-lg:flex-wrap max-lg:w-full justify-end items-center gap-2 lg:leading-10!"
//           role="toolbar"
//           aria-labelledby={moduleTitle}
//         >
//           {children}
//           {buttonName && (
//             <>
//               {onClick && isModel ? (
//                 <ButtonWithProps
//                   type="button"
//                   icon={<Plus className="h-4 w-4" />}
//                   size="lg"
//                   onClick={onClick}
//                   aria-label={`Add new ${buttonName.toLowerCase()}`}
//                 >
//                   {buttonName}
//                 </ButtonWithProps>
//               ) : navigateUrl ? (
//                 <ButtonWithProps
//                   type="button"
//                   size="lg"
//                   variant="default"
//                   icon={<Plus className="h-4 w-4" />}
//                 >
//                   <Link
//                     href={navigateUrl}
//                     prefetch={false}
//                     aria-label={`Add new ${buttonName.toLowerCase()}`}
//                   >
//                     {buttonName}
//                   </Link>
//                 </ButtonWithProps>
//               ) : null}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
