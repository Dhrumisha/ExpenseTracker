/* eslint-disable */
"use client";
import GrapesJsStudio from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import { Editor, usePlugin } from "grapesjs";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Loader from "@/components/common/Loader";
import { customBlocks, tailwindBlocks, tailwindCategories } from "@/constants/cms/blocks";
import { customizeMenuItems, elementGenerator, imageGenerator } from "@/constants/cms/cmsUtils";
import {
  BRAND_TAB_COMPONENT_CLASS,
  BRAND_TAB_IMAGES_CLASS,
  DEFAULT_BRAND_TAB_NAME,
  defaultSLides,
  MULTI_SLIDER_TRAITS,
  NEW_BRAND_SLIDE_DATA,
  REACT_BRAND_TAB_TRAITS,
} from "@/constants/cms/featureProducts";
import {
  customBrandsAToZPlugin,
  customGroupAccordionPlugin,
  customizeImagePlugin,
  customVideoPlugin,
  htmlCssPastePlugin,
  requestConsultationFormPlugin,
} from "@/constants/cms/plugins";
import { extractSymbolsWithStyles } from "@/plugins/symbols/SymbolManager";
import { IPageBuilderProps } from "@/types/content-management/studioEditor.type";
import { AOS_ANIMATIONS, ExtraPanelsOptions } from "@/utils/constants";
import { getTitleCase } from "@/utils/helpers";
import {
  accordionComponent,
  flexComponent,
  rteProseMirror,
  swiperComponent,
  tableComponent,
} from "@grapesjs/studio-sdk-plugins";
// import Aos from "aos";
// import { getCmsMediaLibrary } from "@/services/content-management/content-builder/content-bulder.service";
import { IAOSConfig } from "@/types/content-management/studioEditor.type";
import { getCookie } from "@/utils/common.util";
import axios from "axios";
import { toast } from "react-toastify";
import AddTabModal from "./AddTabModal";
import BrandTabNameModal from "./BrandTabNameModal";
import ImageCountModal from "./ImageCountModal";
import { getAssest } from "@/services/content-management/content-builder/content-builder.service";
import { axiosInstance } from "@/services/axios.util";
import { customSignificantFiguresComponent } from "@/constants/cms/Redefine-dynamic-content-block/significantFeatureComp";
import { customPeaceOfMindPlugin } from "@/constants/cms/Redefine-dynamic-content-block/peace-of-mind";
import { customThereNeverBeenABetterTimePlugin } from "@/constants/cms/Redefine-dynamic-content-block/theres-never-been-a-better-time";
import { customPhotoEditingComponent } from "@/constants/cms/Redefine-dynamic-content-block/photo-editing";
import AddRdMacTab from "./AddRdMacTab";
import { customGetUpToSixServicesPlugin } from "@/constants/cms/Redefine-dynamic-content-block/get-up-to-six-service";
import { customTabsWithSmoothSliderPlugin } from "@/constants/cms/Redefine-dynamic-content-block/tabs-with-smooth-slider";
import { customWhenYouMoveItMovesPlugin } from "@/constants/cms/Redefine-dynamic-content-block/when-you-move-it-moves";
import { customYouFeelAtHomeInNoTimePlugin } from "@/constants/cms/Redefine-dynamic-content-block/you-may-feel-like-home";
import { customExploreNewToolsPlugin } from "@/constants/cms/Redefine-dynamic-content-block/explore-new-tools";
import { customDreamTeamPlugin } from "@/constants/cms/Redefine-dynamic-content-block/dream-team";

const AOS_CONFIG: IAOSConfig = {
  disable: false,
  startEvent: "DOMContentLoaded",
  initClassName: "aos-init",
  animatedClassName: "aos-animate",
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
  throttleDelay: 99,
  duration: 400,
  easing: "ease",
  once: false,
  mirror: false,
  anchorPlacement: "top-bottom",
};

/**
 * Generates a srcset for an image component
 *
 * This function takes an image source URL and an array of widths,
 * and returns a string of srcset values.
 *
 * @param {string} src - The source URL of the image
 * @param {number[]} widths - An array of widths to generate srcset values for
 * @returns {string} A string of srcset values
 */
function generateSrcSet(src: string, widths: number[]): string {
  // 1) Chop off any ?foo=bar
  const [pathPart, query] = src.split("?");
  const qstr = query ? `?${query}` : "";

  // 2) Separate filename base vs. extension
  const dotIndex = pathPart.lastIndexOf(".");
  const base = dotIndex > -1 ? pathPart.slice(0, dotIndex) : pathPart;
  const ext = dotIndex > -1 ? pathPart.slice(dotIndex) : "";

  // 3) Build each candidate
  return widths.map((w) => `${base}${ext}${qstr} ${w}w`).join(", ");
}

const RESPONSIVE_WIDTHS = [320, 640, 960, 1280];
const RESPONSIVE_SIZES = "(max-width: 768px) 100vw, 768px";

function removeHiddenElements(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll('[hidden="true"]').forEach((el) => el.remove());
  return doc.body.outerHTML;
}

const StudioPageEditor = ({
  storeId,
  projectData = {
    default: {
      pages: [
        {
          name: "Home",
          component: `<h1 style="padding:2rem;text-align:center">Hello 👋</h1>`,
        },
      ],
    },
  },
  onLoad,
  onSave,
  autoSave = false,
  autoSaveInterval = 0,
  theme = "light",
  extraPlugins = [],
  extraPanelsOptions = [],
  topLeftButtonsOptions = [],
  assetsFolderPath = "",
  customCssUrls = [],
  isLoading = false,
  isPreview = false,
  showLoader,
  customFonts,
  onPublish = () => {},
  dynamicFormList,
}: IPageBuilderProps) => {
  const editorRef = useRef<Editor | undefined>(undefined);
  const [tabModal, setTabModal] = useState<boolean>(false);
  const [formInitialValues, setFormInitialValues] = useState<any>(null);
  const [showTabName, setShowTabName] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>("featured");
  const [imageCountModal, setImageCountModal] = useState<boolean>(false);
  const [brandTabNameModal, setBrandTabNameModal] = useState<boolean>(false);
  const [selectedBrandTab, setSelectedBrandTab] = useState<string>("");
  const [photoEditingModalType, setPhotoEditingModalType] = useState<
    "add-modal-section" | "edit-modal-section" | null
  >(null);
  const [selectedPhotoEditingSection, setSelectedPhotoEditingSection] = useState<string | null>(
    null
  );

  //Using ref to store the media library and avoid re-fetching it on every render
  type MediaLibraryItem = {
    id: string;
    name: string;
    type: string;
    src: string;
    srcset: string;
    sizes: string;
  };
  const mediaLibraryRef = useRef([]);

  // Effect to handle AOS initialization and cleanup when component mounts/unmounts
  useEffect(() => {
    // if (typeof window !== "undefined" && window.AOS) {
    //   setTimeout(function () {
    // window.AOS.init({
    //   disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    //   startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
    //   initClassName: "aos-init", // class applied after initialization
    //   animatedClassName: "aos-animate", // class applied on animation
    //   useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    //   disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    //   debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    //   throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    //   // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    //   // offset: 120, // offset (in px) from the original trigger point
    //   // delay: 0, // values from 0 to 3000, with step 50ms
    //   duration: 400, // values from 0 to 3000, with step 50ms
    //   easing: "ease", // default easing for AOS animations
    //   once: false, // whether animation should happen only once - while scrolling down
    //   mirror: false, // whether elements should animate out while scrolling past them
    //   anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger
    // });
    // window.AOS.init(AOS_CONFIG);
    // window.AOS.refresh();
    //
    // Check if AOS is already loaded in the window
    if (window.AOS) {
      // Initialize AOS with default configuration
      window.AOS.init(AOS_CONFIG);
      // Refresh AOS after a short delay to ensure proper initialization
      setTimeout(() => {
        if (window.AOS) {
          window.AOS.refresh();
        }
      }, 100);
    }

    // Cleanup function to destroy AOS when component unmounts
    return () => {
      if (window.AOS) {
        window.AOS.destroy();
      }
    };
  }, []);

  const makeEditorReadOnly = (editor: Editor) => {
    // Disable all commands that modify content
    const commandsToDisable = [
      "core:component-delete",
      "core:component-drag",
      "core:component-select",
      "core:component-enter",
      "core:component-exit",
      "core:undo",
      "core:redo",
      "core:copy",
      "core:paste",
      "tlb:clone",
      "tlb:delete",
      "tlb:move",
      "core:close:preview",
    ];

    commandsToDisable.forEach((cmd) => {
      editor.Commands.add(cmd, { run: () => {}, stop: () => {} });
    });

    // Disable drag and drop
    editor.getConfig().dragMode = undefined;

    // Make canvas non-editable
    editor.Canvas.getBody().contentEditable = "false";

    editor.Commands.get("core:preview");
    // Disable selection
    editor.on("component:selected", () => {
      editor.select();
    });

    // Disable component interactions
    editor.DomComponents.getWrapper()?.set("droppable", false);
    editor.DomComponents.getWrapper()?.set("editable", false);

    // Recursively disable all components
    const disableComponent = (component: any) => {
      component.set("droppable", false);
      component.set("editable", false);
      component.set("selectable", false);
      component.set("hoverable", false);
      component.set("removable", false);
      component.set("copyable", false);
      component.set("draggable", false);

      component.components().each((child: any) => {
        disableComponent(child);
      });
    };

    disableComponent(editor.DomComponents.getWrapper());

    const element = document.querySelector(".gs-cmp-close-preview");

    if (element) {
      (element as HTMLElement).style.display = "none";
    }

    const style = document.createElement("style");
    style.textContent = `
      .gs-sidebar-left,
      .gs-sidebar-right,
      .gjs-pn-panels,
      .gjs-toolbar,
      .gjs-toolbar-item,
      .gjs-resizer,
      .gjs-badge,
      .gjs-placeholder,
      .gjs-ghost,
      .gjs-highlighter,
      .gjs-offset-v,
      .gs-cmp-topbar-right,
      .gjs-offset-fixed-v {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  // — onReady: fonts + block icons
  const handleReady = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      /**
       * Hide Import/Export Code Buttons from Studio Topbar
       *
       * The GrapesJS Studio SDK doesn't provide configuration options to hide specific
       * topbar buttons. As a workaround, we identify and remove the import/export buttons
       * by matching their SVG path data.
       *
       * This is done by:
       * 1. Defining the SVG paths that represent the import/export icons
       * 2. Finding all panel buttons in the topbar
       * 3. Removing buttons whose SVG paths match our target icons
       */

      // SVG path for the code import button icon
      const importCodeButtonPath =
        "M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z";

      // SVG path for the code export button icon
      const exportCodeButtonPath =
        "M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z";

      // SVG path for the delete button icon
      const clearPageButtonPath =
        "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";

      // SVG path for the save button icon
      const saveButtonPath =
        "M5,3A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5.5L18.5,3H17V9A1,1 0 0,1 16,10H8A1,1 0 0,1 7,9V3H5M12,4V9H15V4H12M7,12H17A1,1 0 0,1 18,13V19H6V13A1,1 0 0,1 7,12Z";

      // Find all panel buttons in the topbar
      const topbarButtons = document.querySelectorAll("div.gs-cmp-tooltip.gs-utl-relative");

      // Remove buttons that match our target SVG paths
      topbarButtons.forEach((button) => {
        const path = button.querySelector("svg path");
        if (
          path &&
          (path.getAttribute("d") === importCodeButtonPath ||
            path.getAttribute("d") === exportCodeButtonPath ||
            path.getAttribute("d") === clearPageButtonPath)
        ) {
          button.remove();
        } else if (path && path.getAttribute("d") === saveButtonPath) {
          // Get primary color with fallback
          const getPrimaryColor = () => {
            try {
              const cssVar = getComputedStyle(document.documentElement)
                .getPropertyValue("--color-primary")
                ?.trim();
              if (cssVar) return cssVar;
              const testEl = document.createElement("div");
              testEl.className = "bg-primary-light";
              Object.assign(testEl.style, {
                position: "absolute",
                visibility: "hidden",
              });
              document.body.appendChild(testEl);
              const bgColor = getComputedStyle(testEl).backgroundColor;
              document.body.removeChild(testEl);
              if (bgColor && !bgColor.includes("rgba(0, 0, 0, 0)") && bgColor !== "transparent")
                return bgColor;
            } catch {}
            return "#000000";
          };

          const primaryColor = getPrimaryColor();
          const createButton = (label: string, svg: string, onClick: () => void) => {
            const btn = document.createElement("button");
            Object.assign(btn.style, {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0",
              margin: "0",
            });
            const inner = document.createElement("div");
            Object.assign(inner.style, {
              display: "flex",
              gap: "6px",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 12px",
              backgroundColor: primaryColor,
              color: "#ffffff",
              fontSize: "14px",
              borderRadius: "4px",
            });
            inner.className =
              "flex gap-1.5 items-center justify-center px-3 py-1.5 bg-primary-light text-white text-sm rounded-sm";
            inner.innerHTML = `${svg} ${label}`;
            btn.appendChild(inner);
            btn.title = label;
            btn.onclick = onClick;
            return btn;
          };

          const container = document.createElement("div");
          Object.assign(container.style, {
            display: "flex",
            gap: "12px",
            alignItems: "center",
          });
          container.className = "flex gap-3 items-center";

          container.appendChild(
            createButton(
              "Save Page",
              `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor"><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/></svg>`,
              () => handleOnSave(editor)
            )
          );
          container.appendChild(
            createButton(
              "Publish Page",
              `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
              async () => {
                if (onPublish && editorRef.current) {
                  try {
                    showLoader(true);
                    const html = removeHiddenElements(editorRef.current.getHtml());
                    const css = editorRef.current.getCss();

                    // Extract featured products
                    const wrapper = editorRef.current?.DomComponents.getWrapper();
                    let featureProdList: any[] = [];
                    if (wrapper) {
                      const allComponents = getAllComponentsByType(
                        wrapper.components().models,
                        "multi-slide-carousel"
                      );
                      for (const comp of allComponents) {
                        const tabNames = comp.get("tabNames");
                        if (!tabNames || !tabNames.length) continue;
                        let prodTraits: any = {};
                        comp.getTraits().forEach((trt: any) => {
                          prodTraits[trt.attributes.name] = trt.attributes.value;
                        });
                        featureProdList.push({
                          tabNames,
                          traitObj: prodTraits,
                        });
                      }
                    }

                    const processedSliders = featureProdList.map((slider) => ({
                      ...slider,
                      tabNames: slider.tabNames.map((tab: any) => ({
                        ...tab,
                        products: tab.products.map(
                          (product: any) => product.productSEName || product.seName
                        ),
                      })),
                    }));

                    // Extract tailwind CSS
                    const styleTags = Array.from(
                      editorRef.current?.Canvas?.getDocument().querySelectorAll("style")
                    );
                    const twTag = styleTags.find(
                      (tag) =>
                        tag.textContent?.includes("/*! tailwindcss v4") ||
                        tag.textContent?.includes("@layer utilities")
                    );
                    const tailwindCss = twTag?.textContent || "";

                    let purgedCss = "";
                    await fetch("/api/generate-css", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ html, tailwindcss: tailwindCss }),
                    })
                      .then((r) => r.json())
                      .then((css) => {
                        purgedCss = css?.buildCss || tailwindCss;
                      })
                      .catch((err) => {
                        purgedCss = tailwindCss;
                        console.error("Error caught in purging css:", err);
                      });

                    // Extract symbols
                    const projectData = editorRef.current.getProjectData();
                    const { cleanedProjectData, symbolsWithStyles } = extractSymbolsWithStyles(
                      projectData as any
                    );

                    // Call onPublish with all data
                    await onPublish({
                      project: cleanedProjectData,
                      html: html || "",
                      css: css || "",
                      tailwind: purgedCss || "",
                      featuredProducts: processedSliders,
                      symbols: symbolsWithStyles,
                    });
                  } catch (error) {
                    console.error("Error in publish:", error);
                    toast.error("Failed to publish page!");
                  } finally {
                    showLoader(false);
                  }
                }
              }
            )
          );

          button.replaceWith(container);
        }
      });
      //=============> End: Hide Import/Export Code Buttons from Studio Topbar <============
      const layers = editorRef.current?.Layers;
      const setVisible = editorRef.current?.Layers.setVisible.bind(layers);

      layers.setVisible = function (component, value) {
        setVisible(component, value);
        if (value) {
          component.removeAttributes("hidden");
        } else {
          component.addAttributes({ hidden: "true" });
        }
        this.updateLayer(component);
      };

      //=============> Start: Reset base and other styles <============
      /**
       * Reset base and other styles
       */

      const headingStyles = editor?.CssComposer.getRules();
      if (headingStyles) {
        headingStyles.forEach((rule) => {
          if (
            rule.selectorsToString() == "h1,h2,h3,h4,h5,h6" ||
            rule.selectorsToString() == "h2,h3" ||
            rule.selectorsToString() == "*" ||
            rule.selectorsToString() == "a"
          ) {
            editor?.CssComposer.remove(rule);
          }
        });
      }

      editor?.CssComposer.remove(".gjs-container");
      editor?.CssComposer.addRules(`.gjs-container {
          width: 100%;
          margin: 0 auto;
          max-width: 1600px;
        }`);
      //=============> End: Reset base and other styles <============

      //=============> Start: Font Related configs <============
      /**
       * Font Configuration for GrapesJS Editor
       *
       * This section configures custom font options and behavior within the editor:
       * 1. Removes default font settings from heading components
       * 2. Ensures font-family is available as a style option
       * 3. Loads Adobe Typekit fonts in the editor canvas
       * 4. Configures available font options in the style manager
       */

      // Get the heading component type from the DOM Components
      const hType = editor.DomComponents.getType("heading");
      const proto = hType?.model?.prototype;
      const def = proto?.defaults as any;

      // Remove default font-family from heading components to allow custom fonts
      if (proto.defaults.style && proto.defaults.style["font-family"]) {
        delete proto.defaults.style["font-family"];
      }

      // Remove default font-weight to allow custom weight options
      if (proto.defaults.style && proto.defaults.style["font-weight"]) {
        delete proto.defaults.style["font-weight"];
      }

      // Make sure font-family is a stylable property for headings
      const stylableList = Array.isArray(def?.stylable) ? def?.stylable : [];
      if (!stylableList.includes("font-family")) {
        stylableList.push("font-family");
        def.stylable = stylableList; // mutate in place
      }

      // Load Adobe Typekit fonts inside the editor iframe
      // This ensures fonts like Futura PT and Questa Grande are available
      const win = editor.Canvas.getWindow() as any;
      if (win.Typekit && typeof win.Typekit.load === "function") {
        win.Typekit.load();
      }

      // Find the Typography sector in the Style Manager
      const sm = editor.StyleManager;
      // Change labels in Space sector
      const spaceSector = sm.getSectors().find((s: any) => s.get("name") === "Space");
      if (spaceSector) {
        const spaceProps = spaceSector.get("properties");

        // Update Padding label
        const paddingProp = spaceProps?.find((p: any) => p?.get("property") === "padding");
        if (paddingProp) {
          (paddingProp as any).set("name", "Padding (Inner Space (Inside the Box))");
        }

        // Update Margin label
        const marginProp = spaceProps?.find((p: any) => p?.get("property") === "margin");
        if (marginProp) {
          (marginProp as any).set("name", "Margin (Outer Space (Outside the Box))");
        }
      }
      const tSector = sm.getSectors().find((s: any) => s.get("name") === "Typography");
      if (!tSector) return;

      // Find the font-family property in the Typography sector
      const props: any = tSector.get("properties");
      const ffProp = props?.find((p: any) => p?.get("property") === "font-family");
      if (!ffProp) return;

      // Set available font options in the font-family dropdown
      // This includes both system fonts (Arial, Mulish) and Adobe fonts (Futura PT, Questa Grande)
      ffProp?.set("options", [
        { id: "Arial, sans-serif", label: "Arial" },
        ...(customFonts.fontOptions || []),
      ]);
      //=============> End: Font Related configs <============

      const navbarCategory = editor.BlockManager.get("navbar");
      editor.BlockManager.remove(navbarCategory);

      const blocksToRemove = editor.BlockManager.getAll().filter((block: any) => {
        const cat = block.get("category");
        const id = typeof cat === "string" ? cat : cat?.id;
        return id === "forms";
      });

      blocksToRemove.forEach((block) => {
        editor.BlockManager.remove(block.get("id")!);
      });
      /*
        This is a custom command to generate a srcset for the image component
      */
      editor.on("component:update:attributes:src", (comp) => {
        if (!comp.is("image")) return;

        const { src } = comp.getAttributes() as { src?: string };
        if (!src) {
          // If they clear the src completely, drop your old attrs so
          // the <img> simply becomes blank again
          comp.removeAttributes(["srcset", "sizes"]);
          return;
        }

        // Generate a fresh srcset
        const srcset = generateSrcSet(src, RESPONSIVE_WIDTHS);
        if (srcset) {
          // Merge them in—never use a setter that wipes out all of `attributes`
          comp.addAttributes({
            srcset,
            sizes: RESPONSIVE_SIZES,
          });
        } else {
          // If for some reason your helper returned empty, drop them
          comp.removeAttributes(["srcset", "sizes"]);
        }
      });

      /* 
        This is a custom command to hide the left and right sidebars when the preview button is clicked
        This is because the default command is not working as expected
      */
      editor.Commands.add("core:preview", {
        run() {
          editor.runCommand("studio:layoutRemove", {
            id: "layoutId1",
          });
          editor.runCommand("studio:layoutRemove", {
            id: "layoutId2",
          });
          editor.runCommand("studio:layoutRemove", {
            id: "layoutId3",
          });
          editor.runCommand("studio:layoutRemove", {
            id: "layoutId4",
          });
          editor.runCommand("studio:layoutRemove", {
            id: "layoutId5",
          });
          const leftSidebar = document.querySelector(".gs-sidebar-left") as HTMLElement;
          const rightSidebar = document.querySelector(".gs-sidebar-right") as HTMLElement;
          if (leftSidebar) {
            leftSidebar.style.marginLeft = "-45px";
          }
          if (rightSidebar) {
            rightSidebar.style.marginRight = "-400px";
          }
          const canvasWin = editor.Canvas.getWindow();
          const canvasDoc = editor.Canvas.getDocument();
          if (!canvasDoc.querySelector(`link[href*="aos.css"]`)) {
            const aosCSS = canvasDoc.createElement("link");
            aosCSS.rel = "stylesheet";
            aosCSS.href = "https://unpkg.com/aos@next/dist/aos.css";
            canvasDoc.head.appendChild(aosCSS);
          }

          // Inject and init AOS inside the canvas iframe
          const initAOS = () => {
            if (canvasWin.AOS) {
              canvasWin.AOS.init(AOS_CONFIG);
              canvasWin.AOS.refresh();
            }
          };

          if (!canvasWin.AOS) {
            const aosScript = canvasDoc.createElement("script");
            aosScript.src = "https://unpkg.com/aos@next/dist/aos.js";
            aosScript.onload = initAOS;
            canvasDoc.body.appendChild(aosScript);
          } else {
            initAOS();
          }
        },

        stop() {
          const leftSidebar = document.querySelector(".gs-sidebar-left") as HTMLElement;
          const rightSidebar = document.querySelector(".gs-sidebar-right") as HTMLElement;
          if (leftSidebar) {
            leftSidebar.style.removeProperty("margin-left");
          }
          if (rightSidebar) {
            rightSidebar.style.removeProperty("margin-right");
          }
          // Completely remove AOS when exiting preview mode
          const canvasWin = editor.Canvas.getWindow();
          const canvasDoc = editor.Canvas.getDocument();

          // Remove AOS script
          const aosScript = canvasDoc.querySelector(`script[src*="aos.js"]`);
          if (aosScript) {
            aosScript.remove();
          }

          // Remove AOS CSS
          const aosCSS = canvasDoc.querySelector(`link[href*="aos.css"]`);
          if (aosCSS) {
            aosCSS.remove();
          }

          // Remove AOS from window object
          if (canvasWin.AOS) {
            delete canvasWin.AOS;
          }

          // Remove AOS classes from elements
          const elements = canvasDoc.querySelectorAll(".aos-animate, .aos-init");
          elements.forEach((el) => {
            el.classList.remove("aos-animate", "aos-init");
          });
        },
      });

      const renderBrandTabs = (editor: Editor) => {
        const brandComponent = editor?.getWrapper()?.findType("brand-content-toggle")?.[0];
        if (!brandComponent) return;

        const tabElements = brandComponent?.view?.el?.querySelectorAll(
          "[data-brand-list] [brand-name]"
        );

        if (!tabElements) return;

        brandComponent.addAttributes({
          "selected-brand-tab": tabElements?.[0]?.getAttribute("brand-name") || "",
        });

        tabElements?.forEach((tab) => {
          brandComponent.addTrait({
            type: "button",
            name: `${tab.getAttribute("brand-name")}`,
            label: tab.getAttribute("brand-name"),
            category: "Tabs",
            command: () => {
              brandTabClick(tab.getAttribute("brand-name") || "");
            },
          } as any);
        });
      };

      renderBrandTabs(editor);

      const rerenderMultiSliders = (editor: Editor) => {
        const sliders = editor?.getWrapper()?.findType("multi-slide-carousel");

        sliders?.forEach((slider: any) => {
          const view: any = slider.view;
          const existingClasses = slider.getClasses() || [];
          ["container", "mx-auto"].forEach(
            (cls) => !existingClasses.includes(cls) && slider.addClass(cls)
          );

          const tabContainer = slider
            .components()
            .find((c: any) => c.getClasses().includes("brand-tabs"));
          if (tabContainer) {
            tabContainer.components().reset();
          }

          if (!view) return;

          slider.on("change:showProductName", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:showPrice", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:showButton", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:showBrandLogo", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:customMessage", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });
          slider.on("change:showSplitProducts", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:showMoreImages", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:showBorder", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:borderRadius", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:borderColor", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });
          slider.on("change:buttonSize", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          slider.on("change:buttonStyle", () => {
            const traits = getTraitValues(slider);
            const tab = getSelectedTab(slider);
            addProductToTab(tab.products, slider, traits);
          });

          const tabNames = slider.get("tabNames") || [];
          slider.set("tabNames", []);

          if (Array.isArray(tabNames)) {
            tabNames.forEach((tab: any) => {
              const tabName = tab.tabName;
              slider.addTrait({
                type: "button",
                name: tabName,
                label: tabName,
                category: "Tabs",
                draggable: true,
                command: (editor: any) => {
                  const currentComponent = editor.getSelected();
                  if (!currentComponent) return;

                  const savedTabs = currentComponent.get("tabNames") || [];

                  const matchingTab = savedTabs.find((t: any) => t.tabName === tabName);

                  if (matchingTab) {
                    setFormInitialValues(matchingTab); // Your app-specific logic
                    setTabModal(true); // Your app-specific logic
                  }
                },
              });
            });
          }

          const showTabName = slider.get("showTabName");
          setShowTabName(showTabName === "yes" ? true : false);

          const tag = slider.get("productsToDisplay");
          setSelectedTag(tag);

          tabNames.forEach((tab: any) => {
            handleAddTab(
              tab.tabName,
              tab.products,
              tab.displayMethod,
              tab.productType,
              tab.selectedDynamicValue,
              tab.maximumItemsForFetch,
              slider,
              true
            );
          });
        });
      };

      rerenderMultiSliders(editor);

      // Add AOS Animation sector to Style Manager
      sm.addSector("aos-animation", {
        name: "Animation",
        open: false,
        properties: [
          {
            label: "Animation Preset",
            property: "data-aos",
            type: "select",
            default: "fade",
            options: AOS_ANIMATIONS,
            onChange: (value: any) => {
              const selectedComponent = editor.getSelected();
              if (selectedComponent) {
                if (value?.value) {
                  selectedComponent.addAttributes({
                    "data-aos": value?.value,
                  });
                } else {
                  selectedComponent.removeAttributes(["data-aos"]);
                }
              }
            },
            full: true,
          },
          ...ExtraPanelsOptions,
        ],
      });

      const sizeSector = sm.getSectors().find((s: any) => s.get("name") === "Size");

      if (sizeSector) {
        const sizeProps = sizeSector.get("properties");
        const maxSizeProp = sizeProps?.find((p: any) => p?.get("property") === "max-width");
        if (maxSizeProp) {
          (maxSizeProp as any).set("name", "Largest Width Allowed");
        }
        const minSizeProp = sizeProps?.find((p: any) => p?.get("property") === "min-width");
        if (minSizeProp) {
          (minSizeProp as any).set("name", "Smallest Width Allowed");
        }
        const maxHeightProp = sizeProps?.find((p: any) => p?.get("property") === "max-height");
        if (maxHeightProp) {
          (maxHeightProp as any).set("name", "Largest Height Allowed");
        }
        const minHeightProp = sizeProps?.find((p: any) => p?.get("property") === "min-height");
        if (minHeightProp) {
          (minHeightProp as any).set("name", "Smallest Height Allowed");
        }
      }

      //=============> Start: Position Property Customization <============
      /**
       * Position Property Customization for GrapesJS Editor
       *
       * This section customizes the position property options in the style manager
       * to use more user-friendly labels and adds tooltips for each option.
       */

      // Find the Position sector in the Style Manager
      const positionSector = sm.getSectors().find((s: any) => s.get("name") === "Position");

      if (positionSector) {
        const positionProps = positionSector.get("properties");
        const positionProp = positionProps?.find((p: any) => p?.get("property") === "position");

        if (positionProp) {
          // Update the position property options with custom labels and tooltips
          (positionProp as any).set("options", [
            {
              id: "static",
              label: "Normal Flow",
            },
            {
              id: "relative",
              label: "Absolute",
            },
            {
              id: "absolute",
              label: "Free Position",
            },
            {
              id: "fixed",
              label: "Pinned to Screen",
            },
            {
              id: "sticky",
              label: "Scrolls Until Stuck",
            },
          ]);
        }
      }

      //TODO: Uncomment this when fullscreen is required to override the default command
      //Override the default fullscreen command
      // editor.Commands.add("core:fullscreen", {
      //   run(editor, sender, opts) {
      //     // sender?.set("active", true);
      //     console.log("👉 my override run() fired!", isFullscreen);
      //     toggleFullscreen?.(true);
      //   },
      //   stop(editor, sender, opts) {
      //     // sender?.set("active", false);
      //     console.log("👉 my override stop() fired!", isFullscreen);
      //     toggleFullscreen?.(false);
      //   },
      // });

      if (isPreview) {
        makeEditorReadOnly(editor);
      }
    },
    [getTitleCase]
  );

  // Function to get all components of a specific type

  const getAllComponentsByType = (components: any[], type: string): any[] => {
    let result: any[] = [];

    for (const comp of components) {
      if (comp.get("type") === type) {
        result.push(comp);
      }

      const children = comp.components?.();
      if (children && children.length > 0) {
        result = result.concat(getAllComponentsByType(children, type));
      }
    }

    return result;
  };

  /**
   * Handles the save operation for the editor content.
   * This function extracts HTML, CSS, and specific component data from the editor,
   * processes additional styles and fonts, and then saves the data either through
   * a provided onSave callback or to local storage.
   *
   * @param {Editor} editor - The editor instance from which data is extracted and saved.
   */
  const handleOnSave = async (editor: Editor) => {
    try {
      showLoader(true);
      // Extract HTML and CSS from the editor, removing any hidden elements from the HTML.
      const html = removeHiddenElements(editor.getHtml());
      let css = editor.getCss();

      /**
       * ======> feature product extraction starts <======
       * Extracts feature product data from components of type "multi-slide-carousel".
       * This includes traits and attributes like tab names and product display types.
       */

      let tailwindCss = "";

      const wrapper = editorRef.current?.DomComponents.getWrapper();
      if (!wrapper) return;

      const allComponents = getAllComponentsByType(
        wrapper.components().models,
        "multi-slide-carousel"
      );
      let multiSliderPresent = false;
      let featureProdList: any[] = [];
      for (const comp of allComponents) {
        multiSliderPresent = true;
        const tabNames = comp.get("tabNames");
        if (!tabNames || !tabNames.length) continue;

        let prodTraits: any = {};
        comp.getTraits().forEach((trt: any) => {
          prodTraits[trt.attributes.name] = trt.attributes.value;
        });

        featureProdList.push({
          tabNames,
          traitObj: prodTraits,
        });
      }

      if (multiSliderPresent && featureProdList.length === 0) {
        toast.error("Please insert Products in Product sliders or remove them from the page");
        return;
      }

      const processedSliders = featureProdList.map((slider) => ({
        ...slider,
        tabNames: slider.tabNames.map((tab: any) => ({
          ...tab,
          products: tab.products.map((product: any) => product.productSEName || product.seName),
        })),
      }));

      // ======> feature product extraction ends <======

      /**
       * ======> tailwind css extraction starts <======
       * Extracts Tailwind CSS from the editor's canvas by searching for style tags
       * that include specific Tailwind CSS markers.
       */
      const styleTags = Array.from(editor?.Canvas?.getDocument().querySelectorAll("style"));
      const twTag = styleTags.find(
        (tag) =>
          tag.textContent?.includes("/*! tailwindcss v4") ||
          tag.textContent?.includes("@layer utilities")
      );

      tailwindCss = twTag?.textContent || "";

      // const purgedCss = await generatePurgedCss(html, tailwindCss);
      let purgedCss = "";

      await fetch("/api/generate-css", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, tailwindcss: tailwindCss }),
      })
        .then((r) => r.json())
        .then((css) => {
          purgedCss = css?.buildCss || tailwindCss;
        })
        .catch((err) => {
          // if the purge fails, use the original tailwind css
          purgedCss = tailwindCss;
          console.error("Error caught in purging css:", err);
          // toast.error("❌ Failed to generate minified CSS");
        });

      //TODO: Uncomment this when custom css is required to send to the front
      // Fetch custom CSS files from provided URLs and append their content.
      // let customCss = "";
      // let cssPromise = [];
      // if (customCssUrls?.length) {
      //   for (const url of customCssUrls) {
      //     cssPromise.push(
      //       fetch(url)
      //         .then((r) => r.text())
      //         .then((cssText) => {
      //           customCss += ` \n\n ${cssText}`;
      //         })
      //     );
      //   }
      // }
      // ======> tailwind css extraction ends <======

      /**
       *  ======> fonts css extraction starts <======
       * Fetches custom font CSS from Google Fonts and appends it to the fontsCss string.
       * Logs any errors encountered during the fetch process.
       */
      //TODO: Uncomment this when custom fonts are required to send to the front
      // const allFontUrls = [
      //   ...(customFonts.fontUrls || []),
      //   ...(customFonts.fontScriptUrls || []),
      // ];
      // let fontsCss = "";

      // const fetchFontPromises = allFontUrls.map((fontUrl) =>
      //   fetch(fontUrl)
      //     .then((res) => {
      //       if (res.ok) return res.text();
      //       else {
      //         console.warn(
      //           `Failed to fetch font CSS from: ${fontUrl} (Status: ${res.status})`
      //         );
      //         return ""; // skip if failed
      //       }
      //     })
      //     .then((cssText) => {
      //       if (cssText) {
      //         fontsCss += `\n/* CSS from ${fontUrl} */\n${cssText}`;
      //       }
      //     })
      //     .catch((error) => {
      //       console.warn(`Failed to fetch fonts CSS from: ${fontUrl}`, error);
      //     })
      // );
      // // Wait for all CSS and font fetch promises to resolve.
      // await Promise.all(fetchFontPromises);
      // ===> fonts css extraction ends <===

      // =====> symbol extraction starts <=====
      /* 
      Extract symbols from the editor and save them to the seperated object.
      */
      const projectData = editor.getProjectData();
      const { cleanedProjectData, symbolsWithStyles } = extractSymbolsWithStyles(
        projectData as any
      );

      // =====> symbol extraction ends <=====

      // Save the extracted and processed data using the onSave callback or local storage.
      if (onSave) {
        await onSave({
          project: cleanedProjectData,
          html: html,
          // css: `${fontsCss} \n\n ${css}`,
          css: css || "",
          tailwind: purgedCss,
          featuredProducts: processedSliders,
          symbols: symbolsWithStyles,
        });
      } else {
        localStorage.setItem("preview-html", html || "");
        localStorage.setItem("preview-css", css || "");
        localStorage.setItem("preview-tailwindCss", tailwindCss || "");
        localStorage.setItem("projectData", JSON.stringify(editor?.getProjectData()));
      }
      toast("Content saved successfully!");
    } catch (error) {
      console.error("error caught while saving content =>", error);
      toast("Failed to save content!");
    } finally {
      showLoader(false);
    }
  };

  // ======> React Brand Tab Functions Start  <======

  const addBrandTabUi = () => {
    setBrandTabNameModal(true);
  };

  const handleBrandTabNameSubmit = (brandTabName: string) => {
    const component = editorRef.current?.getSelected();
    if (!component) return;

    const ulComp = component.find('[data-brand-list="brand-list"]')?.[0];
    if (!ulComp) return;
    ulComp.components().add({
      tagName: "li",
      classes: ["mr-1", "md:mr-0", "font-semibold", "cursor-pointer"],
      name: `${brandTabName}`,
      attributes: { "brand-name": brandTabName },
      components: [
        {
          tagName: "span",
          name: `${brandTabName}`,
          attributes: { "brand-button": brandTabName },
          classes: [
            "tab",
            "p-2",
            "mr-1",
            "block",
            "hover:text-secondary",
            "focus:outline-none",
            "font-semibold",
            "text-primary",
            "border-black",
          ],
          content: brandTabName,
        },
      ],
    });

    component.addAttributes({
      "selected-brand-tab": brandTabName,
    });

    component.addTrait({
      type: "button",
      name: `${brandTabName}`,
      label: brandTabName,
      category: "Tabs",
      command: () => {
        brandTabClick(brandTabName);
      },
    } as any);

    const imageClass = component.find("[data-main-img]")?.[0]?.getClasses();
    const brandCardClass = component.find("[brand-border-card]")?.[0]?.getClasses();

    let imagePanel = elementGenerator(brandTabName, imageClass, brandCardClass);

    const brandPanel = component.find('[data-brand-panel="brand-panel"]')?.[0];
    if (!brandPanel) return;

    const defaultBrandPanel = brandPanel
      .components()
      .find((child: any) => child.getAttributes()["brand-name"] === DEFAULT_BRAND_TAB_NAME);

    if (defaultBrandPanel) {
      brandPanel.components().remove(defaultBrandPanel);
    }

    brandPanel.components().add(imagePanel);

    brandPanel.components().forEach((child: any) => {
      (child.getEl() as HTMLElement).style.display = "none";
    });

    const selectedLiComp = ulComp.components().forEach((liComp: any) => {
      const brandName = liComp.getAttributes()["brand-name"];
      if (brandName === brandTabName) {
        liComp.components().forEach((child: any) => {
          if (child.getAttributes()["brand-button"] === brandTabName) {
            child?.getEl()?.classList.add("border-b-2", "border-secondary", "text-secondary");
            child?.getEl()?.classList.remove("border-black");
          }
        });
      } else {
        liComp.components().forEach((child: any) => {
          child?.getEl()?.classList.remove("border-b-2", "border-secondary", "text-secondary");
          child?.getEl()?.classList.add("border-black");
        });
      }
    });
    if (!selectedLiComp) return;

    brandPanel.components().forEach((child: any) => {
      const panelAttribute = child.getAttributes()["brand-name"];
      if (panelAttribute === brandTabName) {
        (child.getEl() as HTMLElement).style.display = "flex";
      }
    });

    setTimeout(() => {
      const liComp = ulComp.components().find((liElem: any) => {
        const attrName = liElem.getAttributes()?.["brand-name"];
        return attrName === brandTabName;
      });

      if (!liComp) return;

      const liEl = liComp.getEl(); // DOM <li>
      if (!liEl) return;
      const btn = liEl.querySelector("span"); // DOM <button>

      if (btn) {
        btn.addEventListener("click", () => {
          component.addAttributes({
            "selected-brand-tab": brandTabName,
          });

          // Remove active classes from ALL brand buttons
          ulComp.components().forEach((otherLi: any) => {
            const buttonComp = otherLi
              .components()
              .find((child: any) => child.getAttributes()?.["brand-button"]);

            if (buttonComp) {
              buttonComp
                .getEl()
                .classList.remove("border-b-2", "border-secondary", "text-secondary");
              buttonComp.getEl().classList.add("border-black");
            }
          });

          // Add active classes to the clicked button
          const activeButtonComp = liComp
            .components()
            .find((child: any) => child.getAttributes()?.["brand-button"]);

          if (activeButtonComp) {
            activeButtonComp
              ?.getEl()
              ?.classList.add("border-b-2", "border-secondary", "text-secondary");
            activeButtonComp?.getEl()?.classList.remove("border-black");
          }

          // Toggle visibility of brand panels
          brandPanel.components().forEach((wrapper: any) => {
            const isCurrent = wrapper.getAttributes()?.["brand-name"] === brandTabName;
            isCurrent
              ? ((wrapper.getEl() as HTMLElement).style.display = "flex")
              : ((wrapper.getEl() as HTMLElement).style.display = "none");
          });
        });
      }
    }, 300);
  };

  const brandTabClick = (brandTabName: string) => {
    setSelectedBrandTab(brandTabName);
    setImageCountModal(true);
  };

  const handleImageCountSubmit = (count: number) => {
    const currentComponent = editorRef.current?.getSelected();
    if (!currentComponent) return;

    const ulComp = currentComponent.find('[data-brand-list="brand-list"]')?.[0];
    if (!ulComp) return;

    const imageClass = currentComponent.find("[data-main-img]")?.[0]?.getClasses();
    const brandCardClass = currentComponent.find("[brand-border-card]")?.[0]?.getClasses();
    if (!imageClass || !brandCardClass) return;

    const imageSlides = Array.from({ length: count }, () =>
      imageGenerator(imageClass, brandCardClass)
    );

    ulComp.components().forEach((liComp: any) => {
      const brandName = liComp.getAttributes()["brand-name"];
      if (brandName === selectedBrandTab) {
        if (selectedBrandTab !== currentComponent.getAttributes()["selected-brand-tab"]) {
          liComp.components().forEach((child: any) => {
            if (child.getAttributes()["brand-button"] === selectedBrandTab) {
              child?.getEl()?.classList.add("border-b-2", "border-secondary", "text-secondary");
              child?.getEl()?.classList.remove("border-black");
            }
          });
        }
      } else {
        liComp.components().forEach((child: any) => {
          child?.getEl()?.classList.remove("border-b-2", "border-secondary", "text-secondary");
          child?.getEl()?.classList.add("border-black");
        });
      }
    });

    currentComponent
      .find('[data-brand-panel="brand-panel"]')[0]
      .components()
      .forEach((child: any) => {
        if (child.getAttributes()["brand-name"] === selectedBrandTab) {
          const brandBoardComp = child.find('[data-brand-board="brand-board"]')[0];
          if (!brandBoardComp) return;
          if (selectedBrandTab !== currentComponent.getAttributes()["selected-brand-tab"]) {
            currentComponent.addAttributes({
              "selected-brand-tab": selectedBrandTab,
            });
            (child.getEl() as HTMLElement).style.display = "flex";
          }
          brandBoardComp.components().add([...imageSlides]);
        } else {
          (child.getEl() as HTMLElement).style.display = "none";
        }
      });
  };

  const handleDeleteBrandTab = (tabName: string) => {
    const currentComponent = editorRef.current?.getSelected();
    if (!currentComponent) return;
    const ulComp = currentComponent.find('[data-brand-list="brand-list"]')?.[0];
    const mainPanelComp = currentComponent.find('[data-brand-panel="brand-panel"]')?.[0];
    if (!ulComp || !mainPanelComp) return;

    currentComponent.removeTrait(tabName);

    const brandNameArr = mainPanelComp.components().filter((comp: any) => {
      return (
        comp.getAttributes()["brand-name"] !==
        currentComponent.view?.el.getAttribute("selected-brand-tab")
      );
    });
    if (brandNameArr.length === 0) {
      if (mainPanelComp.components().length === 1) {
        removeElements(tabName);
        mainPanelComp.components().add(NEW_BRAND_SLIDE_DATA);
        currentComponent.addAttributes({
          "selected-brand-tab": "",
        });
      } else {
        return;
      }
    } else if (currentComponent.view?.el.getAttribute("selected-brand-tab") === tabName) {
      const newSelectedEle = ulComp.components().find((comp: any) => {
        return comp.getAttributes()["brand-name"] === brandNameArr[0].getAttributes()["brand-name"];
      });
      if (newSelectedEle) {
        removeElements(tabName);
        newSelectedEle.components().first()?.getEl()?.click();
        currentComponent.addAttributes({
          "selected-brand-tab": newSelectedEle.getAttributes()["brand-name"],
        });

        return;
      }
    } else {
      removeElements(tabName);
    }
  };

  const removeElements = (tabName: string) => {
    const currentComponent = editorRef.current?.getSelected();
    if (!currentComponent) return;
    const ulComp = currentComponent.find('[data-brand-list="brand-list"]')?.[0];
    const mainPanelComp = currentComponent.find('[data-brand-panel="brand-panel"]')?.[0];
    if (!ulComp || !mainPanelComp) return;

    ulComp.components().remove(
      ulComp.components().find((comp: any) => {
        return comp.getAttributes()["brand-name"] === tabName;
      })
    );
    mainPanelComp
      .components()
      .remove(
        mainPanelComp
          .components()
          .find((comp: any) => comp.getAttributes()["brand-name"] === tabName)
      );
  };

  // ======> React Brand Tab Functions End <======

  const reInitializeSwiper = (swiperContainer: Element, totalSlides: number) => {
    const iframe = document.querySelector("iframe");
    if (!iframe) return;

    const Swiper = (iframe?.contentWindow as any)?.Swiper;
    if (!Swiper || !swiperContainer) return;

    const instance = (swiperContainer as any).swiper;
    if (instance) instance.destroy(true, true);

    new Swiper(swiperContainer as HTMLElement, {
      loop: totalSlides > 4 ? true : false,
      slidesPerView: 4,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        1024: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
    });
  };

  const handleDeleteTab = (tabName: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const selectedComponent = editor.getSelected();
    if (!selectedComponent) return;

    const traits = getTraitValues(selectedComponent);
    let tabNames = selectedComponent.get("tabNames") || [];

    // 1. Remove the tab button from .brand-tabs
    const brandTabs = selectedComponent.find(".brand-tabs")[0];
    if (brandTabs) {
      const tabs = brandTabs.components();
      const tabToRemove = tabs.find((comp: any) => comp.getAttributes()["tab-name"] === tabName);
      if (tabToRemove) {
        tabs.remove(tabToRemove);
      }
    }

    // 2. Update trait: tabNames
    const updatedTabNames = tabNames.filter((t: any) => t.tabName !== tabName);

    selectedComponent.set("tabNames", updatedTabNames);

    if ((selectedComponent as any).removeTrait) {
      (selectedComponent as any).removeTrait(tabName);
    }

    // 3. If no tabs remain, optionally load default slide
    if (updatedTabNames.length === 0) {
      loadDefaultSlider(selectedComponent, traits);
      return;
    }

    // 4. Set active tab to first available one
    const nextTab = updatedTabNames[updatedTabNames.length - 1];
    const tabs = brandTabs.components();
    const selectedTab = tabs.find(
      (comp: any) => comp.getAttributes()["tab-name"] === nextTab.tabName
    );

    const btn = selectedTab.find("span")[0];
    if (btn) {
      btn.addClass("text-anchor");
      btn.addClass("border-anchor");
      btn.addClass("hover:text-anchor");
      btn.removeClass("text-primary");
      btn.removeClass("border-transparent");
    }
    selectedComponent.set("selected", nextTab.tabName);

    // 5. Use addProductsToTab to re-inject slide for that tab
    const allTabData = selectedComponent.get("tabNames");
    const currentTab = allTabData.find((t: any) => t.tabName === nextTab.tabName);
    const currentProducts = currentTab?.products || [];
    addProductToTab(currentProducts, selectedComponent, traits);
  };

  const getSelectedTab = (model: any) => {
    const tabs = model.get("tabNames") || [];
    const selectedTab = model.get("selected");

    return tabs.find((tab: any) => tab.tabName === selectedTab);
  };

  const handleAddTab = (
    tabName: string,
    selectedProducts: any[],
    selectionType: string,
    dynamicType: string,
    selectedDynamicValue: string,
    maximumItemsForFetch: number,
    currentComponent?: any,
    onReady: boolean = false
  ) => {
    const selected = editorRef.current?.getSelected?.();
    const component = currentComponent || selected;

    if (!component || typeof component.get !== "function") {
      console.error("Invalid component in handleAddTab");
      return;
    }

    // now continue safely
    const existingTabs = component.get("tabNames") || [];

    if (existingTabs.some((tab: any) => tab.tabName === tabName) && !onReady) {
      toast.error(`Tab "${tabName}" already exists.`);
      return;
    }

    const newTab = {
      tabName,
      products: selectedProducts,
      displayMethod: selectionType,
      productType: dynamicType,
      selectedDynamicValue,
      maximumItemsForFetch,
    };

    const updatedTabs = [...existingTabs, newTab];
    component.set("tabNames", updatedTabs);
    component.set("selected", tabName);

    const traits = {
      ...getTraitValues(component),
      selected: tabName,
      selectedProducts,
    };

    if (component.get("showTabName") === "yes") {
      addTabUI(component, tabName);
    }

    addProductToTab(selectedProducts, component, traits);
    addTabTrait(component, tabName); // ⬅️ also separated
  };

  const handleUpdateTab = (
    tabName: string,
    updatedProducts: any[],
    selectionType: string,
    dynamicType: string,
    selectedDynamicValue: string,
    maximumItemsForFetch: number,
    component?: any
  ) => {
    component = component || (editorRef.current && editorRef.current.getSelected());
    if (!component) return;

    const tabNames = component.get("tabNames") || [];
    const updated = tabNames.map((tab: any) =>
      tab.tabName === tabName
        ? {
            ...tab,
            products: updatedProducts,
            displayMethod: selectionType,
            productType: dynamicType,
            selectedDynamicValue,
            maximumItemsForFetch,
          }
        : tab
    );

    component.set("tabNames", updated);
    component.set("selected", tabName);

    const traits = {
      showProductName: component.get("showProductName"),
      showPrice: component.get("showPrice"),
      showButton: component.get("showButton"),
      showBrandLogo: component.get("showBrandLogo"),
      splitProduct: component.get("showSplitProducts"),
      showBorder: component.get("showBorder"),
      showMoreImages: component.get("showMoreImages"),
      productsToDisplay: component.get("productsToDisplay"),
      borderRadius: component.get("borderRadius"),
      borderColor: component.get("borderColor"),
      buttonSize: component.get("buttonSize"),
      buttonStyle: component.get("buttonStyle"),
      selected: tabName,
      selectedProducts: updatedProducts,
    };

    addProductToTab(updatedProducts, component, traits);
  };
  const addTabUI = (component: any, tabName: string) => {
    const tabContainer = component.find(".brand-tabs")[0];
    if (!tabContainer) return;

    const button = {
      tagName: "span",
      content: tabName,
      attributes: {
        type: "span",
        role: "tab",
        "data-brand": tabName,
        name: tabName,
      },
      classes: [
        "p-2",
        "mr-1",
        "block",
        "focus:outline-none",
        "font-semibold",
        "border-b-2",
        "text-anchor",
        "border-anchor",
        "hover:text-anchor",
        "cursor-pointer",
      ],
    };

    tabContainer.components().forEach((liComp: any) => {
      const btn = liComp.find("span")[0];
      if (btn) {
        btn.removeClass("text-anchor");
        btn.removeClass("border-anchor");
        btn.removeClass("hover:text-anchor");
        btn.addClass("text-primary ");
        btn.addClass("border-transparent");
      }
    });

    const newTab = tabContainer.components().add({
      tagName: "li",
      classes: ["mr-1", "md:mr-0", "font-semibold"],
      components: [button],
      name: tabName,
      attributes: { "tab-name": tabName },
    });
    setTimeout(() => {
      const btnEl = newTab.view?.el.querySelector("span");
      if (!btnEl) return;

      // ✅ Add click listener for future tab switching
      btnEl.addEventListener("click", () => {
        component.set("selected", tabName);

        const btnComp = newTab.find("span")[0];

        tabContainer.components().forEach((liComp: any) => {
          const btn = liComp.find("span")[0];
          if (btn) {
            btn.removeClass("text-anchor");
            btn.removeClass("border-anchor");
            btn.removeClass("hover:text-anchor");
            btn.addClass("text-primary ");
            btn.addClass("border-transparent");
          }
        });

        if (btnComp) {
          btnComp.addClass("text-anchor");
          btnComp.addClass("border-anchor");
          btnComp.addClass("hover:text-anchor");
          btnComp.removeClass("text-primary");
          btnComp.removeClass("border-transparent");
        }

        const productsForThisTab = component
          .get("tabNames")
          .filter((item: any) => item.tabName === tabName)[0].products;
        const traits = getTraitValues(component);
        addProductToTab(productsForThisTab, component, traits);
      });
    }, 200);
  };

  const addTabTrait = (component: any, tabName: string) => {
    component.addTrait({
      type: "button",
      name: `${tabName}`,
      label: tabName,
      category: "Tabs",
      draggable: true,
      command: (editor: Editor) => {
        const currentComponent = editor.getSelected();
        if (!currentComponent) return;
        const currentTabNames = currentComponent.get("tabNames") || [];
        const matchingTab = currentTabNames.find((tab: any) => tab.tabName === tabName);
        setFormInitialValues(matchingTab);
        setTabModal(true);
      },
    } as any);
  };

  const addProductToTab = (products: any, component: any, traits: any) => {
    if (!component) return;

    // Reset existing slides before adding new ones

    const swiperWrapper = component.find(".swiper-wrapper")[0];

    if (!swiperWrapper) {
      return;
    }
    swiperWrapper.components().reset();

    products.forEach((product: any) => {
      const slideComponent = {
        tagName: "div",
        classes: ["swiper-slide"],
        components: [
          {
            tagName: "div",
            classes: ["w-full", "px-2"],
            style: {
              display: "inline-block",
              minWidth: "375px",
            },
            components: [
              {
                tagName: "div",
                classes:
                  traits.showBorder === "yes"
                    ? [
                        "border",
                        traits.borderColor,
                        traits.borderRadius,
                        "bg-white",
                        "relative",
                        "px-6",
                        "py-6",
                      ]
                    : ["bg-white", "relative", "px-6", "py-6"],
                components: [
                  {
                    tagName: "div",
                    classes: ["lg:h-80", "relative"],
                    components: [
                      {
                        tagName: "a",
                        attributes: {
                          href: "javascript:void(0);",
                          title: product?.name || product?.productName,
                        },
                        classes: ["lg:h-80", "m-auto", "block"],
                        components: [
                          {
                            tagName: "img",
                            attributes: {
                              alt: product?.name || product?.productName,
                              src: `https://storagemedia.corporategear.com${
                                product?.productImage?.[0] || product?.imageUrl
                              }`,
                              "data-main-img": "true",
                            },
                            classes: ["m-auto", "max-h-full", "main-product-image"],
                          },
                        ],
                      },
                      // Optional badge
                      {
                        tagName: "div",
                        classes: [
                          "absolute",
                          "w-20",
                          "h-20",
                          "top-0",
                          "left-0",
                          "text-left",
                          "z-10",
                        ],
                        components: [
                          product?.productTagViewModel?.[0]?.imagename && {
                            tagName: "img",
                            attributes: {
                              alt: "Badge",
                              src: `https://storagemedia.corporategear.com${product.productTagViewModel[0].imagename}`,
                            },
                          },
                        ].filter(Boolean),
                      },
                    ],
                  },
                  {
                    tagName: "div",
                    classes: [
                      "flex",
                      "flex-col",
                      "justify-center",
                      "items-center",
                      "text-center",
                      "pt-2",
                    ],
                    components: [
                      traits.showBrandLogo === "yes" && {
                        tagName: "div",
                        classes: ["h-auto", "cursor-pointer", "mb-3"],
                        components: [
                          product?.productBrandLogo && {
                            tagName: "img",
                            attributes: {
                              alt: product.brandName,
                              src: `https://storagemedia.corporategear.com${product.productBrandLogo}`,
                            },
                          },
                        ],
                      },
                      traits.showProductName === "yes" && {
                        tagName: "div",
                        classes: [
                          "font-family1",
                          "text-base",
                          "text-blue-700",
                          "overflow-hidden",
                          "mb-3",
                          "min-h-[3rem]",
                        ],
                        components: [
                          {
                            tagName: "a",
                            attributes: {
                              href: "javascript:void(0);",
                              title: product?.name || product?.productName,
                            },
                            classes: ["block", "overflow-hidden", "line-clamp-2"],
                            content: product?.name || product?.productName,
                          },
                        ],
                      },
                      traits.showPrice === "yes" && {
                        tagName: "div",
                        classes: [
                          "font-family1",
                          "font-semibold",
                          "text-primary",
                          "text-base",
                          "tracking-wider",
                          "mb-3",
                        ],
                        content: `MSRP $${product.salePrice}`,
                      },
                      traits.splitProduct === "yes" &&
                        product?.splitproductList?.length > 0 && {
                          tagName: "ul",
                          classes: [
                            "flex",
                            "flex-wrap",
                            "justify-center",
                            "gap-1",
                            "mt-2",
                            "overflow-hidden",
                            "max-w-full",
                            "px-2",
                          ],
                          components: (() => {
                            const thumbnails = [];
                            const limit = 6;
                            const variants = product.splitproductList;

                            variants.slice(0, limit).forEach((variant: any, index: number) => {
                              thumbnails.push({
                                tagName: "a",
                                attributes: {
                                  href: "#",
                                  title: variant.colorName,
                                },
                                components: [
                                  {
                                    tagName: "li",
                                    classes: [
                                      "w-7",
                                      "h-7",
                                      "border-2",
                                      "overflow-hidden",
                                      "hover:border-primary",
                                      "cursor-pointer",
                                      index === 0 ? "border-primary" : "border-gray-300",
                                      ...(index > 0 ? ["ml-1"] : []),
                                    ],
                                    components: [
                                      {
                                        tagName: "img",
                                        attributes: {
                                          src: `https://storagemedia.corporategear.com${variant.imageurl}`,
                                          alt: variant.colorName,
                                          class: "max-h-full m-auto variant-thumb",
                                          "data-variant": variant.imageurl,
                                        },
                                      },
                                    ],
                                  },
                                ],
                              });
                            });

                            if (variants.length > limit) {
                              const extra = variants.length - limit;
                              thumbnails.push({
                                tagName: "li",
                                classes: [
                                  "w-7",
                                  "h-7",
                                  "text-center",
                                  "border-2",
                                  "border-gray-300",
                                  "hover:border-primary",
                                  "bg-secondary",
                                  "text-xs",
                                  "font-semibold",
                                  "flex",
                                  "items-center",
                                  "justify-center",
                                  "text-black",
                                  "cursor-pointer",
                                  "ml-1",
                                ],
                                components: [
                                  {
                                    tagName: "span",
                                    content: `+${extra}`,
                                  },
                                ],
                              });
                            }

                            return thumbnails;
                          })(),
                        },

                      traits.showMoreImages === "yes" &&
                        product?.moreImages?.length > 0 && {
                          tagName: "ul",
                          classes: [
                            "flex",
                            "flex-wrap",
                            "justify-center",
                            "gap-1",
                            "mt-2",
                            "overflow-hidden",
                            "max-w-full",
                            "px-2",
                          ],
                          components: (() => {
                            const thumbnails = [];
                            const limit = 6;
                            const variants = product.moreImages;

                            variants.slice(0, limit).forEach((variant: any, index: number) => {
                              thumbnails.push({
                                tagName: "a",
                                attributes: {
                                  href: "#",
                                  title: variant?.attributeOptionName,
                                },
                                components: [
                                  {
                                    tagName: "li",
                                    classes: [
                                      "w-7",
                                      "h-7",
                                      "border-2",
                                      "overflow-hidden",
                                      "hover:border-primary",
                                      "cursor-pointer",
                                      index === 0 ? "border-primary" : "border-gray-300",
                                      ...(index > 0 ? ["ml-1"] : []),
                                    ],
                                    components: [
                                      {
                                        tagName: "img",
                                        attributes: {
                                          src: `https://storagemedia.corporategear.com${variant?.imageUrl}`,
                                          alt: variant?.attributeOptionName,
                                          class: "max-h-full m-auto variant-thumb",
                                          "data-variant": variant?.imageUrl,
                                        },
                                      },
                                    ],
                                  },
                                ],
                              });
                            });

                            if (variants.length > limit) {
                              const extra = variants.length - limit;
                              thumbnails.push({
                                tagName: "li",
                                classes: [
                                  "w-7",
                                  "h-7",
                                  "text-center",
                                  "border-2",
                                  "border-gray-300",
                                  "hover:border-primary",
                                  "bg-secondary",
                                  "text-xs",
                                  "font-semibold",
                                  "flex",
                                  "items-center",
                                  "justify-center",
                                  "text-black",
                                  "cursor-pointer",
                                  "ml-1",
                                ],
                                components: [
                                  {
                                    tagName: "span",
                                    content: `+${extra}`,
                                  },
                                ],
                              });
                            }

                            return thumbnails;
                          })(),
                        },
                      traits.showButton === "yes" && {
                        tagName: "a",
                        classes: ["btn", traits.buttonStyle, traits.buttonSize, "mt-3"],
                        attributes: {
                          href: `/${product?.productSEName}.html`,
                          title: "View Product",
                        },
                        content: "DETAILS",
                      },
                    ].filter(Boolean),
                  },
                ],
              },
            ],
          },
        ],
        script: function () {
          setTimeout(() => {
            const el = this as unknown as HTMLElement;

            const mainImg = el.querySelector(".main-product-image");
            const variantThumbs = el.querySelectorAll(".variant-thumb");
            if (!mainImg || variantThumbs.length === 0) return;

            const originalSrc = mainImg.getAttribute("src");

            variantThumbs.forEach((thumb) => {
              thumb.addEventListener("mouseenter", () => {
                const newSrc = thumb.getAttribute("data-variant");
                if (newSrc)
                  mainImg.setAttribute("src", `https://storagemedia.corporategear.com${newSrc}`);
              });

              thumb.addEventListener("mouseleave", () => {
                mainImg.setAttribute("src", originalSrc || "");
              });
            });
          }, 100);
        },
      };

      swiperWrapper.components().add(slideComponent);
    });

    // 🌀 Reinitialize Swip
    const el = component.view?.el as HTMLElement;
    const swiperContainer = el?.querySelector(".swiper");
    if (swiperContainer) reInitializeSwiper(swiperContainer, products.length);
  };

  const loadDefaultSlider = (model: any, traits: any) => {
    const tabNames = model.get("tabNames");
    if (tabNames?.length) {
      tabNames?.forEach((tab: any) => {
        const tabName = tab.tabName;
        model.removeTrait(tabName);
      });
      model.set("tabNames", []);
      model.set("selected", "");
    }

    const tabContainer = model.find(".brand-tabs")[0];
    tabContainer?.components().reset();

    const swiperWrapper = model.find(".swiper-wrapper")[0];
    const swiperContainer = model.find(".swiper")[0];

    if (swiperWrapper && swiperContainer) {
      swiperWrapper?.components().reset();
      swiperWrapper.components().add(defaultSLides(traits));
      reInitializeSwiper(swiperContainer.view?.el, 6);
    }
  };

  const getTraitValues = (model: any) => ({
    showProductName: model.get("showProductName"),
    showPrice: model.get("showPrice"),
    showButton: model.get("showButton"),
    showBrandLogo: model.get("showBrandLogo"),
    productsToDisplay: model.get("productsToDisplay"),
    customMessage: model.get("customMessage"),
    splitProduct: model.get("showSplitProducts"),
    showMoreImages: model.get("showMoreImages") || "no",
    showBorder: model.get("showBorder"),
    borderRadius: model.get("borderRadius"),
    borderColor: model.get("borderColor"),
    buttonSize: model.get("buttonSize"),
    buttonStyle: model.get("buttonStyle"),
  });

  // ======> Photo Editing Section Functions Start <======

  const handleAddUpdatePhotoEditingSection = (tabName: string) => {
    const currentComponent = editorRef.current?.getSelected();
    if (!currentComponent) return;

    if (selectedPhotoEditingSection) {
      const selectedItem = currentComponent.find(
        `[button-label="${selectedPhotoEditingSection}"]`
      )[0];
      const selectedContent = currentComponent.find(
        `[tab-content="${selectedPhotoEditingSection}"]`
      )[0];
      const tabButtonItems = currentComponent.find("[button-name]");
      const tabContentItems = currentComponent.find("[tab-content]");
      const selectedItemButton = currentComponent.find(
        `[button-name="${selectedPhotoEditingSection}"]`
      )[0];
      const selectedItemTab = currentComponent.find(
        `[tab-name="${selectedPhotoEditingSection}"]`
      )[0];

      if (selectedItem) {
        selectedItem.set("content", tabName);
        selectedItem.addAttributes({
          "button-label": tabName,
        });
        selectedItemButton.addAttributes({
          "button-name": tabName,
        });
      }

      if (selectedContent) {
        selectedContent.addAttributes({
          "tab-content": tabName,
        });
      }

      if (selectedItemTab) {
        selectedItemTab.addAttributes({
          "tab-name": tabName,
        });
      }

      const selectedTrait = currentComponent.getTrait(`${selectedPhotoEditingSection}`);
      if (selectedTrait) {
        currentComponent.removeTrait(selectedPhotoEditingSection);
        currentComponent.addTrait({
          type: "button",
          name: tabName,
          label: tabName,
          command: () => {
            setSelectedPhotoEditingSection(tabName);
            setPhotoEditingModalType("edit-modal-section");
          },
        } as any);
      }

      if (tabButtonItems && tabButtonItems.length > 0) {
        tabButtonItems.forEach((tabButtonItem: any, index: number) => {
          if (index === 0) {
            tabButtonItem.getEl()?.classList.remove("text-secondary");
            tabButtonItem.getEl()?.classList.remove("tab");
            tabButtonItem.getEl()?.classList.add("text-gradient");
          } else {
            tabButtonItem.getEl()?.classList.remove("text-gradient");
            tabButtonItem.getEl()?.classList.add("text-secondary");
            tabButtonItem.getEl()?.classList.add("tab");
          }
        });
      }

      if (tabContentItems && tabContentItems.length > 0) {
        tabContentItems.forEach((tabContentItem: any, index: number) => {
          if (index === 0) {
            tabContentItem.getEl()?.classList.remove("hidden");
            tabContentItem.getEl()?.classList.add("block");
          } else {
            tabContentItem.getEl()?.classList.remove("block");
            tabContentItem.getEl()?.classList.add("hidden");
          }
        });
      }

      setSelectedPhotoEditingSection(null);

      return;
    }

    currentComponent.addTrait({
      type: "button",
      name: `${tabName}`,
      label: `${tabName}`,
      command: () => {
        setSelectedPhotoEditingSection(tabName);
        setPhotoEditingModalType("edit-modal-section");
      },
    } as any);
    const photoEditingTabs = currentComponent.find('[tab-container="tabContainer"]')[0];

    const photoEditingContainer = currentComponent.find(
      '[photo-editing-container="photoEditingContainer"]'
    )[0];

    const defaultTabContent = photoEditingContainer.find('[tab-content="default"]')[0];

    if (defaultTabContent) defaultTabContent.remove();

    const defaultTabButton = photoEditingTabs.find('[tab-name="default"]')[0];
    if (defaultTabButton) defaultTabButton.remove();

    photoEditingTabs.components().add({
      tagName: "li",
      classes: [`${tabName}`],
      attributes: {
        "tab-name": `${tabName}`,
      },
      components: [
        {
          tagName: "button",
          classes: [
            "relative",
            "tab",
            "block",
            "lg:text-4xl",
            "text-xl",
            "text-secondary",
            "font-semibold",
            "whitespace-nowrap",
          ],
          attributes: {
            "button-name": `${tabName}`,
          },
          components: [
            {
              tagName: "span",
              content: `${tabName}`,
              attributes: {
                "button-label": `${tabName}`,
              },
            },
          ],
        },
      ],
    });

    photoEditingContainer.components().add({
      tagName: "div",
      classes: ["text-center", "py-8"],
      droppable: true,
      editable: true,
      removable: false,
      attributes: {
        "tab-content": `${tabName}`,
      },
      components: [
        {
          tagName: "h2",
          classes: ["text-3xl", "font-bold", "mb-4"],
          components: [
            {
              type: "text",
              content: "Photo Editing Services",
            },
          ],
        },
        {
          tagName: "p",
          classes: ["text-gray-600", "mb-6"],
          components: [
            {
              type: "text",
              content: "Professional photo editing to enhance your images.",
            },
          ],
        },
        {
          type: "button",
          classes: ["bg-blue-500", "text-white", "px-6", "py-2", "rounded"],
          content: "Get Started",
        },
      ],
    });

    setTimeout(() => {
      const tabButtonItems = photoEditingTabs.find("[button-name]");
      const tabContentItems = photoEditingContainer.find("[tab-content]");

      tabButtonItems.forEach((tabButtonItem: any, index: number) => {
        if (index === 0) {
          tabButtonItem.getEl()?.classList.remove("text-secondary");
          tabButtonItem.getEl()?.classList.remove("tab");
          tabButtonItem.getEl()?.classList.add("text-gradient");
        } else {
          tabButtonItem.getEl()?.classList.remove("text-gradient");
          tabButtonItem.getEl()?.classList.add("text-secondary");
          tabButtonItem.getEl()?.classList.add("tab");
        }
      });

      tabButtonItems.forEach((tabButtonItem: any, index: number) => {
        const checkSlashExist: any = [];
        tabButtonItem.find("span")?.forEach((test: any) => {
          checkSlashExist.push(test.getEl().innerHTML);
        });
        if (index === tabButtonItems.length - 1 || checkSlashExist.includes("/")) {
          return;
        } else {
          tabButtonItem.components().add({
            tagName: "span",
            classes: ["!text-secondary", "m-2"],
            content: "/",
            attributes: {
              "button-slash": "slash",
            },
          });
        }
      });

      tabContentItems.forEach((tabContentItem: any, index: number) => {
        if (index === 0) {
          tabContentItem.getEl()?.classList.remove("hidden");
          tabContentItem.getEl()?.classList.add("block");
        } else {
          tabContentItem.getEl()?.classList.remove("block");
          tabContentItem.getEl()?.classList.add("hidden");
        }
      });

      tabButtonItems.forEach((tabButtonItem: any) => {
        tabButtonItem.getEl().addEventListener("click", (e: any) => {
          const currentSelectedItem = e.currentTarget as HTMLElement;
          const currentSelectedItemName = currentSelectedItem.getAttribute("button-name");

          tabButtonItems.forEach((tabButtonItem: any) => {
            if (tabButtonItem.getEl().getAttribute("button-name") === currentSelectedItemName) {
              tabButtonItem.getEl()?.classList.remove("text-secondary");
              tabButtonItem.getEl()?.classList.remove("tab");
              tabButtonItem.getEl()?.classList.add("text-gradient");
            } else {
              tabButtonItem.getEl()?.classList.remove("text-gradient");
              tabButtonItem.getEl()?.classList.add("text-secondary");
              tabButtonItem.getEl()?.classList.add("tab");
            }
          });

          tabContentItems.forEach((tabContentItem: any) => {
            if (tabContentItem.getEl().getAttribute("tab-content") === currentSelectedItemName) {
              tabContentItem.getEl()?.classList.remove("hidden");
              tabContentItem.getEl()?.classList.add("block");
            } else {
              tabContentItem.getEl()?.classList.remove("block");
              tabContentItem.getEl()?.classList.add("hidden");
            }
          });
        });
      });
    }, 300);
  };

  const handleDeletePhotoEditingSection = (tabName: string) => {
    const currentComponent = editorRef.current?.getSelected();
    if (!currentComponent) return;

    const photoEditingTabs = currentComponent.find("[tab-name]");
    const photoEditingContainer = currentComponent.find("[tab-content]");
    const photoEditingSlash = currentComponent.find("[button-slash]");

    if (photoEditingSlash)
      photoEditingSlash.forEach((item: any) => {
        item.remove();
      });

    const selectedTrait = currentComponent.getTrait(tabName);
    if (selectedTrait) currentComponent.removeTrait(tabName);

    if (photoEditingTabs.length === 1) {
      alert("You cannot delete the last section");
      return;
    }

    const selectedButton = currentComponent.find(`[tab-name="${tabName}"]`)[0];
    const selectedContainer = currentComponent.find(`[tab-content="${tabName}"]`)[0];

    if (selectedButton) selectedButton.remove();
    if (selectedContainer) selectedContainer.remove();

    const tabButtonItems = currentComponent.find("[button-name]");

    if (tabButtonItems.length === 1) {
      const checkSlashExist: any = [];
      tabButtonItems[0].find("span")?.forEach((test: any) => {
        const removeElement = test.getEl().innerHTML;
        checkSlashExist.push(removeElement);
        if (checkSlashExist.includes("/")) {
          test.remove();
        }

        test.getEl()?.classList.remove("text-secondary");
        test.getEl()?.classList.remove("tab");
        test.getEl()?.classList.add("text-gradient");
      });
      return;
    } else {
      tabButtonItems.forEach((tabButtonItem: any, index: number) => {
        if (index === 0) {
          tabButtonItem.getEl()?.classList.remove("text-secondary");
          tabButtonItem.getEl()?.classList.remove("tab");
          tabButtonItem.getEl()?.classList.add("text-gradient");
          tabButtonItem.components().add({
            tagName: "span",
            classes: ["!text-secondary", "m-2"],
            content: "/",
            attributes: {
              "button-slash": "slash",
            },
          });
        } else if (index === tabButtonItems.length - 1) {
          tabButtonItem.getEl()?.classList.remove("text-gradient");
          tabButtonItem.getEl()?.classList.add("text-secondary");
          tabButtonItem.getEl()?.classList.add("tab");
          return;
        } else {
          tabButtonItem.components().add({
            tagName: "span",
            classes: ["!text-secondary", "m-2"],
            content: "/",
            attributes: {
              "button-slash": "slash",
            },
          });
          tabButtonItem.getEl()?.classList.remove("text-gradient");
          tabButtonItem.getEl()?.classList.add("text-secondary");
          tabButtonItem.getEl()?.classList.add("tab");
        }
      });
    }

    photoEditingContainer.forEach((container: any, index: number) => {
      if (index === 0) {
        container.getEl()?.classList.remove("hidden");
        container.getEl()?.classList.add("block");
      } else {
        container.getEl()?.classList.remove("block");
        container.getEl()?.classList.add("hidden");
      }
    });

    setSelectedPhotoEditingSection(null);
    setPhotoEditingModalType(null);
  };

  // — storageManager callbacks
  const buildStorage = useMemo(
    () => ({
      type: "self",
      autosaveChanges: autoSave,
      autosaveIntervalMs: autoSave ? autoSaveInterval : 0,
      autosave: autoSave,
      stepsBeforeSave: autoSave ? 1 : 0,
      onLoad: async () => {
        if (onLoad) {
          return await onLoad();
        }
        // default: feed in-prop projectData
        return {
          id: "page-1",
          project: projectData,
        };
      },
      onSave: async ({ editor }: { editor: Editor }) => {
        handleOnSave(editor);
      },
    }),
    [autoSave, autoSaveInterval, onLoad, onSave, projectData]
  );
  const extendSwiperComponent = (editor: Editor) => {
    const dc = editor.DomComponents;

    const existingType = dc.getType("swiper");

    if (!existingType) return;

    dc.addType("swiper", {
      model: {
        defaults: {
          ...existingType.model.prototype.defaults,
          styles: `
            .swiper-button-prev::after,
            .swiper-button-next::after {
              content: none !important;
              display: none !important;
              background: none !important;
            }
          `,
          traits: [
            ...(existingType.model.prototype.defaults.traits || []),
            {
              type: "select",
              name: "navPosition",
              label: "Nav Button Position",
              default: "center",
              options: [
                { id: "top-left", name: "Top left" },
                { id: "top-right", name: "Top Right" },
                { id: "center", name: "Center" },
                { id: "bottom-center", name: "Bottom Center" },
              ],
              changeProp: 1,
            },
            {
              type: "textarea",
              name: "customArrowLeftSVG",
              label: "Custom Arrow Left SVG",
              placeholder: "<svg ...>...</svg>",
              changeProp: true,
            },
            {
              type: "textarea",
              name: "customArrowRightSVG",
              label: "Custom Arrow Right SVG",
              placeholder: "<svg ...>...</svg>",
              changeProp: true,
            },
          ],
        },
      },
      view: {
        init() {
          this.listenTo(this.model, "change:navPosition", this.updateNavPosition);
          this.listenTo(this.model, "change:customArrowLeftSVG", this.updateCustomLeftArrowIcon);
          this.listenTo(this.model, "change:customArrowRightSVG", this.updateCustomRightArrowIcon);
          this.listenTo(this.model, "change:navigation", this.updateArrowSvgValues);
        },

        updateArrowSvgValues() {
          const navigation = this.model.get("navigation");
          if (!navigation) {
            this.model.set("customArrowLeftSVG", "");
            this.model.set("customArrowRightSVG", "");
          }
        },

        updateCustomLeftArrowIcon() {
          const svgMarkup = this.model.get("customArrowLeftSVG")?.trim();
          if (!svgMarkup) return;

          const isValid = /<svg[\s\S]*?>[\s\S]*?<\/svg>/i.test(svgMarkup);
          if (!isValid) {
            toast.error("Invalid SVG added");
            return;
          }

          const leftButtonComp = this.model
            .components()
            .find((c: any) => c.getClasses().includes("swiper-button-prev"));

          if (leftButtonComp) {
            leftButtonComp.components().reset();
            leftButtonComp.components().add({
              content: svgMarkup,
              type: "text",
            });
            this.updateNavPosition();
          }
        },

        updateCustomRightArrowIcon() {
          const svgMarkup = this.model.get("customArrowRightSVG")?.trim();
          if (!svgMarkup) return;

          const isValid = /<svg[\s\S]*?>[\s\S]*?<\/svg>/i.test(svgMarkup);
          if (!isValid) {
            toast("Invalid SVG added");
            return;
          }

          const rightButtonComp = this.model
            .components()
            .find((c: any) => c.getClasses().includes("swiper-button-next"));

          if (rightButtonComp) {
            rightButtonComp.components().reset();
            rightButtonComp.components().add({
              content: svgMarkup,
              type: "text",
            });
            // this.updateNavPosition;
            this.updateNavPosition();
          }
        },

        updateNavPosition() {
          const position = this.model.get("navPosition");
          const model = this.model;
          const buttons = model
            .components()
            .filter((comp: any) =>
              ["swiper-button-prev", "swiper-button-next"].some((cls) =>
                comp.getClasses().includes(cls)
              )
            );

          if (!buttons || buttons.length < 2) return;

          const leftButton = buttons.find((comp) =>
            comp.getClasses().includes("swiper-button-prev")
          );
          const rightButton = buttons.find((comp) =>
            comp.getClasses().includes("swiper-button-next")
          );

          const cleanBaseStyle = {
            position: "absolute",
            top: "auto",
            bottom: "auto",
            left: "auto",
            right: "auto",
            transform: "none",
          };
          leftButton?.setStyle(cleanBaseStyle);
          rightButton?.setStyle(cleanBaseStyle);

          if (position === "top-right") {
            leftButton?.addStyle({
              top: "0px",
              right: "52px",
              width: "32px",
              height: "32px",
              margin: "0px",
            });
            rightButton?.addStyle({
              top: "0px",
              right: "10px",
              width: "32px",
              height: "32px",
              margin: "0px",
            });
          } else if (position === "top-left") {
            leftButton?.addStyle({
              top: "0px",
              left: "10px",
              width: "32px",
              height: "32px",
              margin: "0px",
            });
            rightButton?.addStyle({
              top: "0px",
              left: "52px",
              width: "32px",
              height: "32px",
              margin: "0px",
            });
          } else if (position === "bottom-center") {
            leftButton?.addStyle({
              bottom: "0px",
              left: "calc(50% - 42px)",
              width: "32px",
              height: "32px",
              margin: "0px",
            });
            rightButton?.addStyle({
              bottom: "0px",
              right: "calc(50% - 42px)",
              width: "32px",
              height: "32px",
              margin: "0px",
            });
          } else if (position === "center") {
            leftButton?.addStyle({
              top: "calc(50% - 16px)",
              bottom: "inherit",
              left: "10px",
              width: "32px",
              height: "32px",
              margin: "0",
            });
            rightButton?.addStyle({
              top: "calc(50% - 16px)",
              bottom: "inherit",
              right: "10px",
              width: "32px",
              height: "32px",
              margin: "0",
            });
          }
        },
      },
    });
  };

  // — plugin aggregator
  const plugins = useMemo(
    () => [
      swiperComponent?.init({
        block: false,
        licenseKey: process.env.NEXT_PUBLIC_GRAPESJS_LICENSE_KEY,
      }),
      extendSwiperComponent,
      tableComponent.init({
        block: { category: "Extra", label: "Table" },
        licenseKey: process.env.NEXT_PUBLIC_GRAPESJS_LICENSE_KEY,
      }),
      accordionComponent.init({
        block: { category: "Extra", label: "Accordion" },
        licenseKey: process.env.NEXT_PUBLIC_GRAPESJS_LICENSE_KEY,
      }),
      flexComponent?.init({
        licenseKey: process.env.NEXT_PUBLIC_GRAPESJS_LICENSE_KEY,
      }),
      rteProseMirror?.init({
        licenseKey: process.env.NEXT_PUBLIC_GRAPESJS_LICENSE_KEY,
        toolbar({ items }) {
          return items?.filter((item: any) => item?.id !== "image");
        },
      }),
      (editor: Editor) => {
        tailwindCategories?.forEach((c) => editor.Blocks.categories.add(c));
      },
      customBrandsAToZPlugin,
      customizeImagePlugin,
      (editor: Editor) =>
        requestConsultationFormPlugin(editor, storeId || "", dynamicFormList || []),
      customVideoPlugin,
      customGroupAccordionPlugin,
      htmlCssPastePlugin,
      // advancedTabPlugin,
      // custom blocks

      // advancedTabPlugin,
      //RD - Dream Team starts here
      customDreamTeamPlugin,
      customPeaceOfMindPlugin,
      customThereNeverBeenABetterTimePlugin,
      customExploreNewToolsPlugin,
      customWhenYouMoveItMovesPlugin,
      customYouFeelAtHomeInNoTimePlugin,
      customGetUpToSixServicesPlugin,
      customTabsWithSmoothSliderPlugin,

      (editor: Editor) => {
        Object.entries(customBlocks).forEach(([key, data]) => editor.Blocks.add(key, data));
        Object.entries(tailwindBlocks).forEach(([key, data]) => editor.Blocks.add(key, data));
        extraPlugins.forEach((fn) => fn(editor));
      },
    ],
    [extraPlugins]
  );

  // — fetch media library
  const fetchMediaLibrary = async (refresh = false) => {
    try {
      if (mediaLibraryRef?.current?.length && !refresh) return mediaLibraryRef?.current;

      const response = await getAssest();

      // Get assets array from response
      // const assetsArray = response?.assets;

      // if (!assetsArray || !Array.isArray(assetsArray)) {
      //   console.warn(
      //     "Invalid response structure - expected assets array:",
      //     response
      //   );
      //   mediaLibraryRef.current = [];
      //   return [];
      // }

      if (response?.assets?.length > 0) {
        const imageAssets = response?.assets?.filter(
          (item: any) => item?.contentType?.startsWith("image/") // for assest only image type
        );

        console.log("Filtered image assets:", imageAssets);

        mediaLibraryRef.current = imageAssets.map((item: any) => {
          try {
            // For Azure blob storage URLs, generate srcset if URL is valid
            const srcSet = item.url ? generateSrcSet(item.url, RESPONSIVE_WIDTHS) : "";
            return {
              id: item.name,
              name: item.name || "Untitled",
              type: "image",
              src: item.url || "",
              srcset: srcSet,
              sizes: RESPONSIVE_SIZES,
            };
          } catch (err) {
            console.error("Error processing asset:", item, err);
            // Return basic structure even if srcset generation fails
            return {
              id: item.url || item.name,
              name: item.name || "Untitled",
              type: "image",
              src: item.url || "",
              srcset: "",
              sizes: RESPONSIVE_SIZES,
            };
          }
        });
      } else {
        mediaLibraryRef.current = [];
      }

      console.log("Mapped media library:", mediaLibraryRef.current);
      return mediaLibraryRef?.current || [];
    } catch (error) {
      console.error("Error fetching media library:", error);
      toast.error("Failed to load assets!");
      return [];
    }
  };

  const handleOnUpload = async ({ files }: { files: File[] }) => {
    try {
      if (Array.from(files)?.some((file) => !file.type?.includes("image"))) {
        toast.error("Only images are allowed to be uploaded!");
        return;
      }
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const apiResponse = await axiosInstance.post(`/admin/cms/upload-assets`, formData, {
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (apiResponse?.status === 200) {
        toast.success("Assets uploaded successfully!");
        return await fetchMediaLibrary(true);
      } else {
        toast.error("Failed to upload assets!");
        return mediaLibraryRef?.current;
      }
    } catch (error) {
      toast.error("Failed to upload assets!");
      return mediaLibraryRef?.current;
    }
  };

  // — build assets props
  const buildAssets = {
    storageType: "self",
    onUpload: async ({ files }: { files: File[] }) => {
      return await handleOnUpload({ files });
    },
    onLoad: async () => {
      return await fetchMediaLibrary();
    },
  };

  return (
    <div className="w-full h-screen">
      {isLoading && (
        <Loader className="absolute top-0 left-0 w-full h-full z-50 bg-gray-light dark:bg-gray-dark opacity-50" />
      )}
      <GrapesJsStudio
        onReady={handleReady}
        options={{
          storage: buildStorage as any,
          assets: buildAssets as any,
          theme,
          pages: false,
          settingsMenu: false,
          licenseKey: process.env.NEXT_PUBLIC_GRAPESJS_LICENSE_KEY || "",
          plugins,
          project: projectData,
          gjsOptions: {
            storageManager: {
              type: "self",
              autoload: true, // call load() on init
              autosave: autoSave, // call store() on every change
              stepsBeforeSave: autoSave ? 1 : 0, // how many changes before a save fires
            },

            //Here all the Devices Specification is made
            //Uncomment this deviceManager code, if you want to apply your custom devices specification
            // deviceManager: {
            //   devices: [
            //     {
            //       name: "Auto",
            //       width: "100%",
            //       height: "100%",
            //       widthMedia: "",//If we don't put empty here, then Style Manager will not work.
            //     },
            //     {
            //       name: "Mobile Portrait",
            //       width: "450px",
            //       height: "900px",
            //       widthMedia: "",
            //     },
            //     {
            //       name: "Mobile Landscape",
            //       width: "915px",
            //       height: "415px",
            //       widthMedia: "",
            //     },
            //     {
            //       name: "Desktop",
            //       width: "1230px",
            //       height: "1000px",
            //       widthMedia: "",
            //     },
            //     {
            //       name: "Tablet",
            //       width: "1024px",
            //       height: "1400px",
            //       widthMedia: "",
            //     },
            //   ],
            // },
            canvas: {
              styles: [
                "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
                ...customCssUrls,
                ...(customFonts.fontUrls || []),
                "/storecss/style-tab.css",
              ],

              scripts: [
                // Tailwind CSS browser build for styling
                "https://unpkg.com/@tailwindcss/browser@4",
                "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
                ...(customFonts.fontScriptUrls || []),
              ],
            },
            plugins: [
              //TODO: Uncomment this when above tailwind script is not working
              // grapesjsTailwindPlugin,
              usePlugin((editor: any) => {
                (editor.DomComponents.addType("multi-slide-carousel", {
                  model: {
                    defaults: {
                      //To override the default context menu
                      contextMenu: ({ items }: any) =>
                        items?.filter((item: any) => item?.id !== "symbolCreate"),
                      tagName: "div",
                      classes: [
                        "custom-slider",
                        "w-full",
                        "container",
                        "mx-auto",
                        // "px-4",
                        // "lg:px-0",
                        "mb-5",
                        "sm:mb-6",
                        "lg:mb-8",
                      ],
                      components: [
                        {
                          tagName: "ul",
                          classes: [
                            "brand-tabs",
                            "w-full",
                            "flex",
                            "justify-center",
                            "md:max-w-4xl",
                            "mx-auto",
                            "flex-wrap",
                          ],
                          components: [],
                        },
                        {
                          tagName: "div",
                          attributes: { class: "swiper" },
                          components: [
                            {
                              tagName: "div",
                              classes: ["swiper-wrapper", "lg:pt-8", "pt-4"],
                              components: defaultSLides({
                                showProductName: "yes",
                                showPrice: "yes",
                                showButton: "yes",
                                showBrandLogo: "yes",
                                productsToDisplay: "featured",
                                customMessage: "",
                                splitProduct: "yes",
                                showMoreImages: "no",
                                showBorder: "yes",
                                borderColor: "border-lightcolor",
                                borderRadius: "rounded-none",
                                buttonSize: "btn-sm",
                                buttonStyle: "btn-primary",
                              }),
                            },
                            {
                              tagName: "div",
                              attributes: { class: "swiper-button-prev" },
                              components: [
                                {
                                  tagName: "text",
                                  content: `
                                     <button
        name="Previous"
        type="button"
        className="bg-white -ml-2 lg:-ml-4 flex justify-center items-center w-10 h-10 rounded-full shadow focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="#000"
        >
          <path
            d="M16.1,22L6.1,12,16.1,2l1.8,1.8-8.2,8.2,8.2,8.2-1.8,1.8Z"
            stroke-width="0px"
          />
        </svg>
      </button>
                                  `,
                                },
                              ],
                            },
                            {
                              tagName: "div",
                              attributes: { class: "swiper-button-next" },
                              components: [
                                {
                                  tagName: "text",
                                  content: `
                                    <button
        name="Next"
        type="button"
        className="uniqueId.current}-rightArrow bg-white -ml-2 lg:-ml-4 flex justify-center items-center w-10 h-10 rounded-full shadow focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          version="1.1"
          viewBox="0 0 24 24"
          fill="#000"
        >
          <path
            d="M7.9,22l-1.8-1.8,8.2-8.2L6.1,3.8l1.8-1.8,10,10-10,10Z"
            stroke-width="0px"
          />
        </svg>
      </button>
                                `,
                                },
                              ],
                            },
                          ],
                        },
                      ],

                      script: function () {
                        setTimeout(() => {
                          const el = this as unknown as HTMLElement;
                          const swiperContainer = el.querySelector(".swiper");

                          if (!swiperContainer) return;

                          new (window as any).Swiper(swiperContainer, {
                            loop: true,
                            slidesPerView: 4,
                            spaceBetween: 20,
                            navigation: {
                              nextEl: ".swiper-button-next",
                              prevEl: ".swiper-button-prev",
                            },
                            breakpoints: {
                              1024: { slidesPerView: 4 },
                              768: { slidesPerView: 3 },
                              480: { slidesPerView: 2 },
                              0: { slidesPerView: 1 },
                            },
                          });
                        }, 100);
                      },

                      traits: [
                        ...MULTI_SLIDER_TRAITS,

                        {
                          type: "button",
                          name: "addTab",
                          label: "+ Add Tab",
                          category: "Tabs",
                          text: "Add Tab",
                          full: true,
                          command: (editor: Editor) => {
                            const selected = editor.getSelected();
                            if (!selected) return;
                            const showTabName = selected.get("showTabName");
                            setShowTabName(showTabName === "yes" ? true : false);
                            const tabNames = selected.get("tabNames");

                            if (showTabName === "no" && tabNames && tabNames.length >= 1) {
                              toast.error(
                                'You can only add multiple tabs if "Show Tab Name" is set to "Yes".'
                              );
                              return;
                            }

                            setFormInitialValues(null);
                            setTabModal(!tabModal);
                          },
                        },
                      ],
                    },
                  },
                  view: {
                    init() {
                      const model = (this as any).model;
                      model.on("change:showProductName", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:showTabName", () => {
                        const traits = getTraitValues(model);
                        setShowTabName(model.get("showTabName") === "yes" ? true : false);

                        loadDefaultSlider(model, traits);
                      });

                      model.on("change:showPrice", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:showButton", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:showBrandLogo", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:customMessage", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:showSplitProducts", () => {
                        const traits = getTraitValues(model);
                        const splitProduct = traits["splitProduct"];
                        let showMoreImages = traits["showMoreImages"];
                        if (splitProduct === "yes" && showMoreImages === "yes") {
                          toast.info(
                            "You can use either Split Products or Attribute Images settings, not both. Therefore, Show Attribute Images will be set to ‘No’."
                          );
                          model.set("showMoreImages", "no");
                          showMoreImages = "no";
                        }
                        console.log(traits);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, {
                            ...traits,
                            showMoreImages: showMoreImages,
                          });
                        } else {
                          addProductToTab(tab.products, model, {
                            ...traits,
                            showMoreImages: showMoreImages,
                          });
                        }
                      });

                      model.on("change:showMoreImages", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        let splitProduct = traits["splitProduct"];
                        const showMoreImages = traits["showMoreImages"];
                        if (splitProduct === "yes" && showMoreImages === "yes") {
                          toast.info(
                            "You can use either Split Products or Attribute Images settings, not both. Therefore, Split Products will be set to ‘No’."
                          );
                          model.set("showSplitProducts", "no");
                          splitProduct = "no";
                        }
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, {
                            ...traits,
                            splitProduct: splitProduct,
                          });
                        } else {
                          addProductToTab(tab.products, model, {
                            ...traits,
                            splitProduct: splitProduct,
                          });
                        }
                      });

                      model.on("change:showBorder", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);

                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:borderRadius", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);

                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:borderColor", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);

                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });
                      model.on("change:buttonSize", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);

                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });
                      model.on("change:buttonStyle", () => {
                        const traits = getTraitValues(model);
                        const tab = getSelectedTab(model);
                        if (!tab || !tab.products) {
                          loadDefaultSlider(model, traits);
                        } else {
                          addProductToTab(tab.products, model, traits);
                        }
                      });

                      model.on("change:productsToDisplay", () => {
                        const traits = getTraitValues(model);
                        setSelectedTag(model.get("productsToDisplay"));
                        loadDefaultSlider(model, traits);
                      });
                    },
                  },
                }),
                  editor.BlockManager.add("multi-slide-carousel", {
                    label: "Product Slider (4 at a time)",
                    category: "tw-cg-components",
                    media: `/images/thumbnails/cg-contentblocks/product-slider.svg`,
                    content: { type: "multi-slide-carousel" },
                  }));
                (editor.DomComponents.addType("brand-content-toggle", {
                  model: {
                    defaults: {
                      type: "brand-content-toggle",
                      tagName: "div",
                      attributes: { class: "pt-4" },

                      script: function () {
                        setTimeout(() => {
                          const el = this as unknown as HTMLElement;

                          if (!el || typeof el.querySelector !== "function") return;
                          // Select tabs and content container by data attributes
                          const tabList = el.querySelector("[data-brand-list]");
                          const brandContainer = el.querySelector("[data-brand-container]");

                          if (!tabList || !brandContainer) return;
                          const switchTab = (brandName: string) => {
                            el.setAttribute("selected-brand-tab", brandName);
                            // 1. Toggle tab button styles
                            const allTabs = tabList.querySelectorAll("[brand-name]");

                            const brandPanels = brandContainer?.querySelectorAll("[brand-name]");
                            allTabs.forEach((tab) => {
                              const isActive = tab.getAttribute("brand-name") === brandName;
                              const btn = tab.querySelector("[brand-button]");
                              if (btn) {
                                btn.classList.toggle("border-b-2", isActive);
                                btn.classList.toggle("border-secondary", isActive);
                                btn.classList.toggle("text-secondary", isActive);
                                btn.classList.toggle("border-black", !isActive);
                              } else {
                                console.warn("Button not found in tab:", tab);
                              }
                            });
                            // 2. Toggle panel visibility
                            brandPanels.forEach((panel) => {
                              const isActive = panel.getAttribute("brand-name") === brandName;
                              // panel.classList.toggle("hidden", !isActive);
                              (panel as HTMLElement).style.display = isActive ? "flex" : "none";
                              // (panel as any).addStyle({
                              //   display: isActive ? "flex" : "none",
                              // });
                            });
                          };
                          // Initial load — use first tab as default
                          const firstTab = tabList.querySelector("[brand-name]");
                          if (firstTab) {
                            const initialBrand = firstTab.getAttribute("brand-name");
                            if (initialBrand) switchTab(initialBrand);
                          }
                          // Add click event for all buttons inside tabs
                          const allTabList = tabList.querySelectorAll("[brand-name]");
                          allTabList.forEach((tab) => {
                            tab.addEventListener("click", (e) => {
                              e.stopPropagation();
                              // e.preventDefault();
                              // const btn = (e.target as HTMLElement).closest(
                              //   "[brand-name]"
                              // );
                              // if (!btn) return;
                              const brand = tab.getAttribute("brand-name");
                              if (brand) switchTab(brand);
                              return null;
                            });
                          });
                        }, 300);
                      },
                      components: [
                        {
                          tagName: "div",
                          name: "Brand Toggle Component",
                          classes: ["flex", "flex-col", "md:flex-row", "text-default-text"],
                          components: [
                            {
                              tagName: "div",
                              name: "Brand Space",
                              classes: ["w-full"],
                              attributes: {
                                "data-brand-space": "brand-space",
                              }, // ⬅️ tab buttons will go here
                              components: [
                                {
                                  tagName: "ul",
                                  name: "Brand Names",
                                  classes: [
                                    "w-full",
                                    "flex",
                                    "justify-center",
                                    "md:max-w-4xl",
                                    "mx-auto",
                                    "flex-wrap",
                                  ],
                                  attributes: {
                                    "data-brand-list": "brand-list",
                                  },
                                  components: [],
                                },

                                {
                                  tagName: "div",
                                  name: "Brand Container",
                                  classes: ["mx-4", "pb-4"],
                                  attributes: {
                                    "data-brand-container": "brand-container",
                                  },
                                  components: [
                                    {
                                      tagName: "div",
                                      name: "Brand Panel",
                                      classes: [
                                        "w-full",
                                        "max-w-6xl",
                                        "text-center",
                                        "mx-auto",
                                        "lg:pt-8",
                                        "pt-4",
                                      ],
                                      attributes: {
                                        "data-brand-panel": "brand-panel",
                                      },
                                      components: NEW_BRAND_SLIDE_DATA,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      traits: [
                        ...REACT_BRAND_TAB_TRAITS,
                        {
                          type: "button",
                          name: "addBrandTab",
                          label: "+ Add Brand Tab",
                          category: "Tabs",
                          text: "Add Brand Tab",
                          full: true,
                          command: () => {
                            addBrandTabUi();
                          },
                        },
                      ],
                    },
                  },
                  view: {
                    init() {
                      const model = (this as any).model;

                      model.on("change:borderRadiusBrandTab", () => {
                        const borerRadiusValue = model.get("borderRadiusBrandTab");
                        const bgColor = model.get("backgroundColorBrandTab");
                        this.applyProperties(borerRadiusValue, bgColor);
                      });

                      model.on("change:backgroundColorBrandTab", () => {
                        const bgColor = model.get("backgroundColorBrandTab");
                        const borderRad = model.get("borderRadiusBrandTab");
                        this.applyProperties(borderRad, bgColor);
                      });
                    },

                    applyProperties(borderRad: string, bgColor: string) {
                      const selectedComp = editorRef.current?.getSelected();
                      if (!selectedComp) return;

                      const brandPanels = selectedComp.find("[brand-border-card]"); // Fetch all the divs with brand-border-card attribute
                      if (!brandPanels) return;

                      const allImages = selectedComp.find("[data-main-img]");
                      if (!allImages) return;

                      allImages.forEach((panel: any) => {
                        panel.setClass([]); // First remove all the classes
                        panel.setClass([...BRAND_TAB_IMAGES_CLASS, bgColor]); // Then add the new classes
                      });

                      brandPanels.forEach((panel: any) => {
                        panel.setClass([]); // First remove all the classes
                        panel.setClass([...BRAND_TAB_COMPONENT_CLASS, borderRad]); // Then add the new classes
                      });
                    },
                  },
                }),
                  editor.BlockManager.add("brand-content-toggle", {
                    label: "Brand Tabs (4 at a time)",
                    category: "tw-cg-components",
                    media: `/images/thumbnails/cg-contentblocks/brand-tabs.svg`,
                    content: { type: "brand-content-toggle" },
                  }));
              }),
            ],
          },
          layout: {
            default: {
              type: "row",
              style: { height: "100%" },
              children: [
                {
                  type: "column",
                  id: "leftSidebar",
                  className: "gs-sidebar-left gs-utl-transition-spacing",
                  style: {
                    padding: 5,
                    gap: 5,
                    borderRightWidth: 1,
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "button",
                      tooltip: "Blocks",
                      icon: `<svg viewBox="0 0 24 24" role="presentation" class="gs-cmp-icon" style="width: 18px; height: 18px;"><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" style="fill: currentcolor;"></path></svg>`,
                      editorEvents: {
                        "studio:layoutToggle:layoutId5": ({
                          fromEvent,
                          setState,
                        }: {
                          fromEvent: Record<string, any>; //patch
                          setState: (state: { active: boolean }) => void;
                          editor: Editor;
                        }) => {
                          setState({ active: fromEvent.isOpen as boolean }); //patch
                        },
                      },
                      onClick: ({ editor }: { editor: Editor }) => {
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId2",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId1",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId3",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId4",
                        });
                        editor.runCommand("studio:layoutToggle", {
                          id: "layoutId5",
                          layout: {
                            type: "panelBlocks",
                            symbols: false,
                            // Filtering out Only Tailwind blocks
                            blocks: (data: any) => {
                              return data.blocks.filter((block: any) => {
                                const categoryId = block.category?.id;
                                return tailwindCategories.some((cat) => cat.id === categoryId);
                              });
                            },
                            itemLayout: ({ block, attributes }: any) => ({
                              type: "column",
                              className: "col-start-1 col-span-2",
                              style: { width: "100%" },
                              children: [
                                {
                                  type: "custom",
                                  component: () => (
                                    <div
                                      className="w-full hover:shadow-lg transition-shadow duration-200 rounded-lg border bg-white"
                                      {...attributes}
                                    >
                                      <div
                                        {...attributes}
                                        className="aspect-video overflow-hidden rounded-md p-2 border-none"
                                      >
                                        <Image
                                          draggable={false}
                                          src={`${block.getMedia()}`}
                                          alt={`${block.getLabel()}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                      </div>
                                      <div className="label text-center mt-3 text-lg font-large font-semibold">
                                        {block.getLabel()}
                                      </div>
                                    </div>
                                  ),
                                },
                              ],
                            }),
                          },
                          header: { label: "Blocks" },
                          placer: {
                            type: "static",
                            layoutId: "hiddenLeftContainer",
                          },
                          style: { width: "400px", overflow: "hidden" },
                        });
                      },
                    },
                    {
                      type: "button",
                      tooltip: "Sections",
                      icon: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 18H2V20H21V18M19 10V14H4V10H19M20 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H20C20.55 16 21 15.55 21 15V9C21 8.45 20.55 8 20 8M21 4H2V6H21V4Z"></path></svg>`,
                      editorEvents: {
                        "studio:layoutToggle:layoutId1": ({
                          fromEvent,
                          setState,
                        }: {
                          fromEvent: Record<string, any>; //patch
                          setState: (state: { active: boolean }) => void;
                        }) => setState({ active: fromEvent.isOpen as boolean }), //patch
                      },
                      onClick: ({ editor }: { editor: Editor }) => {
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId2",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId3",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId4",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId5",
                        });
                        editor.runCommand("studio:layoutToggle", {
                          id: "layoutId1",
                          layout: {
                            type: "panelBlocks",

                            // Filtering out Non-tailwind blocks
                            blocks: (data: any) => {
                              return data.blocks.filter((block: any) => {
                                const categoryId = block.category?.id;
                                return !tailwindCategories.some((cat) => cat.id === categoryId);
                              });
                            },
                          },
                          header: { label: "Sections" },
                          placer: {
                            type: "static",
                            layoutId: "hiddenLeftContainer",
                          },
                          style: { width: 300, overflow: "hidden" },
                        });
                      },
                    },
                    {
                      type: "button",
                      tooltip: "Layers",
                      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: currentcolor;"> <g fill="currentColor"> <path d="M12.3 3.31a.75.75 0 0 0-.6 0l-9 4a.75.75 0 0 0 0 1.38l9 4a.75.75 0 0 0 .6 0l9-4a.75.75 0 0 0 0-1.38z"></path> <path d="M3.3 11.31a.75.75 0 0 0-.6 1.37l9 4a.75.75 0 0 0 .6 0l9-4a.75.75 0 0 0-.6-1.37L12 15.18z"></path> <path d="M3.3 15.31a.75.75 0 0 0-.6 1.37l9 4a.75.75 0 0 0 .6 0l9-4a.75.75 0 0 0-.6-1.37L12 19.18z"></path> </g> </svg>`,
                      editorEvents: {
                        "studio:layoutToggle:layoutId2": ({
                          fromEvent,
                          setState,
                        }: {
                          fromEvent: Record<string, any>; //patch
                          setState: (state: { active: boolean }) => void;
                        }) => setState({ active: fromEvent.isOpen as boolean }), //patch
                      },
                      onClick: ({ editor }: { editor: Editor }) => {
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId1",
                        });

                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId3",
                        });

                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId4",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId5",
                        });

                        editor.runCommand("studio:layoutToggle", {
                          id: "layoutId2",
                          layout: { type: "panelLayers" },
                          header: { label: "Layers" },
                          placer: {
                            type: "static",
                            layoutId: "hiddenLeftContainer",
                          },
                          style: { width: 300, overflow: "hidden" },
                        });
                      },
                    },

                    //Disable Global Styles from panels, uncomment this when it required to show global styles
                    // {
                    //   type: "button",
                    //   tooltip: "Global Styles",
                    //   icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: currentcolor;"> <path d="M20 14H6c-2.2 0-4 1.8-4 4s1.8 4 4 4h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2M6 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m.3-8L13 5.3a2 2 0 0 1 2.8 0l2.8 2.8c.8.8.8 2 0 2.8l-.9 1.1H6.3M2 13.5V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v1.5l-8 8Z"></path></svg>`,
                    //   editorEvents: {
                    //     "studio:layoutToggle:layoutId3": ({
                    //       fromEvent,
                    //       setState,
                    //     }: {
                    //       fromEvent: { isOpen: boolean };
                    //       setState: (state: { active: boolean }) => void;
                    //     }) => setState({ active: fromEvent.isOpen }),
                    //   },
                    //   onClick: ({ editor }: { editor: Editor }) => {
                    //     editor.runCommand("studio:layoutRemove", {
                    //       id: "layoutId2",
                    //     });
                    //     editor.runCommand("studio:layoutRemove", {
                    //       id: "layoutId1",
                    //     });
                    //     editor.runCommand("studio:layoutRemove", {
                    //       id: "layoutId4",
                    //     });
                    //     editor.runCommand("studio:layoutToggle", {
                    //       id: "layoutId3",
                    //       layout: { type: "panelGlobalStyles" },
                    //       header: { label: "Global Styles" },
                    //       placer: {
                    //         type: "static",
                    //         layoutId: "hiddenLeftContainer",
                    //       },
                    //       style: {
                    //         width: 300,
                    //         overflow: "hidden",
                    //       },
                    //     });
                    //   },
                    // },
                    {
                      type: "button",
                      tooltip: "Assest",
                      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: currentcolor;"><path d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"></path></svg>`,
                      editorEvents: {
                        "studio:layoutToggle:layoutId4": ({
                          fromEvent,
                          setState,
                        }: {
                          fromEvent: Record<string, any>; //patch
                          setState: (state: { active: boolean }) => void;
                        }) => setState({ active: fromEvent.isOpen as boolean }), //patch
                      },
                      onClick: ({ editor }: { editor: Editor }) => {
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId2",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId1",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId3",
                        });
                        editor.runCommand("studio:layoutRemove", {
                          id: "layoutId5",
                        });
                        editor.runCommand("studio:layoutToggle", {
                          id: "layoutId4",
                          layout: {
                            type: "panelAssets",
                            content: {
                              itemsPerRow: 2,
                              header: { upload: true },
                            },
                          },
                          header: {
                            label: "Assest",
                          },
                          placer: {
                            type: "static",
                            layoutId: "hiddenLeftContainer",
                          },
                          style: {
                            width: 300,
                            overflow: "hidden",
                            padding: "8px",
                            height: "100%",
                          },
                        });
                      },
                    },
                    ...extraPanelsOptions,
                  ],
                },
                {
                  id: "hiddenLeftContainer",
                  type: "column",
                  style: {
                    zIndex: 0,
                    position: "relative",
                    height: "100%",
                  },
                },
                {
                  type: "column",
                  style: { height: "100%", width: "100%" },
                  children: [
                    {
                      type: "sidebarTop",
                      leftContainer: {
                        buttons: topLeftButtonsOptions,
                      },
                    },
                    {
                      type: "canvas",
                      className: "cms-editor-grapesjs-canvas",
                    },
                  ],
                },
                {
                  type: "sidebarRight",
                  style: {
                    width: "300px",
                  },
                  children: {
                    type: "tabs",
                    value: "styles",
                    tabs: [
                      {
                        id: "styles",
                        label: "Styles",
                        children: {
                          type: "column",
                          style: { height: "100%" },
                          children: [
                            { type: "panelSelectors", style: { padding: 5 } },
                            { type: "panelStyles", style: { padding: 5 } },
                          ],
                        },
                      },
                      {
                        id: "props",
                        label: "Properties",
                        children: {
                          type: "panelProperties",
                          style: { padding: 5, height: "100%" },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          components: {
            contextMenu: ({ items }: { items: any[] }) => {
              // Map the items to update their labels
              const updatedItems = customizeMenuItems(items);

              return [...updatedItems];
            },
            toolbar: ({ items }: { items: any[]; component: any }) => {
              return items.filter((_: any, idx: number) => idx !== 0);
            },
          },

          // globalStyles: {
          //   default: [
          //     // ── COLORS ──
          //     {
          //       id: "primary",
          //       selector: ":root",
          //       property: "--gjs-pn-col1",
          //       field: "color",
          //       defaultValue: "#cf549e",
          //       label: "Primary",
          //       category: { id: "colors", label: "Colors", open: true },
          //     },
          //     {
          //       id: "secondary",
          //       selector: ":root",
          //       property: "--gjs-pn-col2",
          //       field: "color",
          //       defaultValue: "#392330",
          //       label: "Secondary",
          //       category: { id: "colors", label: "Colors" },
          //     },
          //     {
          //       id: "accent",
          //       selector: ":root",
          //       property: "--gjs-pn-col3",
          //       field: "color",
          //       defaultValue: "#ffb347",
          //       label: "Accent",
          //       category: { id: "colors", label: "Colors" },
          //     },
          //     {
          //       id: "success",
          //       selector: ":root",
          //       property: "--gjs-pn-col4",
          //       field: "color",
          //       defaultValue: "#28a745",
          //       label: "Success",
          //       category: { id: "colors", label: "Colors" },
          //     },
          //     {
          //       id: "warning",
          //       selector: ":root",
          //       property: "--gjs-pn-col5",
          //       field: "color",
          //       defaultValue: "#ffc107",
          //       label: "Warning",
          //       category: { id: "colors", label: "Colors" },
          //     },
          //     {
          //       id: "error",
          //       selector: ":root",
          //       property: "--gjs-pn-col6",
          //       field: "color",
          //       defaultValue: "#dc3545",
          //       label: "Error",
          //       category: { id: "colors", label: "Colors" },
          //     },

          //     // ── BODY ──
          //     {
          //       id: "bodyBg",
          //       selector: "body",
          //       property: "background-color",
          //       field: "color",
          //       defaultValue: "#ffffff",
          //       label: "Body background",
          //       category: { id: "body", label: "Body", open: true },
          //     },
          //     {
          //       id: "bodyColor",
          //       selector: "body",
          //       property: "color",
          //       field: "color",
          //       defaultValue: "#000000",
          //       label: "Color",
          //       category: { id: "body", label: "Body" },
          //     },
          //     {
          //       id: "bodyFontSize",
          //       selector: "body",
          //       property: "font-size",
          //       field: {
          //         type: "number",
          //         min: 0.1,
          //         max: 10,
          //         step: 0.1,
          //         units: ["rem"],
          //       },
          //       defaultValue: "1rem",
          //       label: "Font Size",
          //       category: { id: "body", label: "Body" },
          //     },
          //     {
          //       id: "bodyLineHeight",
          //       selector: "body",
          //       property: "line-height",
          //       field: {
          //         type: "number",
          //         min: 1,
          //         max: 3,
          //         step: 0.1,
          //         units: ["rem"],
          //       },
          //       defaultValue: "1.75rem",
          //       label: "Line Height",
          //       category: { id: "body", label: "Body" },
          //     },
          //     {
          //       id: "bodyFontFamily",
          //       selector: "body",
          //       property: "font-family",
          //       field: {
          //         type: "select",
          //         options: [
          //           { id: "Default", label: "Default" },
          //           { id: "Arial, sans-serif", label: "Arial" },
          //           { id: "Inter, sans-serif", label: "Inter" },
          //           { id: "futura-pt, sans-serif", label: "Futura PT" },
          //           { id: "futura-pt-bold, serif", label: "Futura PT Bold" },
          //           { id: "questa-grande, serif", label: "Questa Grande" },
          //           { id: "Outfit, sans-serif", label: "Outfit" },
          //         ],
          //       },
          //       defaultValue: "Outfit, sans-serif",
          //       label: "Font Family",
          //       category: { id: "body", label: "Body" },
          //     },

          //     // ── HEADING ──
          //     {
          //       id: "headingColor",
          //       selector: "h1,h2,h3,h4,h5,h6",
          //       property: "color",
          //       field: "color",
          //       defaultValue: "var(--gjs-t-colc)",
          //       label: "Color",
          //       category: { id: "heading", label: "Heading", open: true },
          //     },
          //     {
          //       id: "headingFontSize",
          //       selector: "h1,h2,h3,h4,h5,h6",
          //       property: "font-size",
          //       field: {
          //         type: "number",
          //         min: 0.5,
          //         max: 6,
          //         step: 0.1,
          //         units: ["rem"],
          //       },
          //       defaultValue: "1.5rem",
          //       label: "Font Size",
          //       category: { id: "heading", label: "Heading" },
          //     },
          //     {
          //       id: "headingLineHeight",
          //       selector: "h1,h2,h3,h4,h5,h6",
          //       property: "line-height",
          //       field: {
          //         type: "number",
          //         min: 1,
          //         max: 3,
          //         step: 0.1,
          //         units: ["rem"],
          //       },
          //       defaultValue: "2.5rem",
          //       label: "Line Height",
          //       category: { id: "heading", label: "Heading" },
          //     },
          //     {
          //       id: "headingFontFamily",
          //       selector: "h1,h2,h3,h4,h5,h6",
          //       property: "font-family",
          //       field: {
          //         type: "select",
          //         options: [
          //           { id: "Default", label: "Default" },
          //           { id: "Arial, sans-serif", label: "Arial" },
          //           { id: "Inter, sans-serif", label: "Inter" },
          //           { id: "futura-pt, sans-serif", label: "Futura PT" },
          //           { id: "futura-pt-bold, serif", label: "Futura PT Bold" },
          //           { id: "questa-grande, serif", label: "Questa Grande" },
          //           { id: "Outfit, sans-serif", label: "Outfit" },
          //         ],
          //       },
          //       defaultValue: "Outfit, sans-serif",
          //       label: "Font Family",
          //       category: { id: "heading", label: "Heading" },
          //     },

          //     // ── SUBHEADING ──
          //     {
          //       id: "subheadingColor",
          //       selector: "h2,h3",
          //       property: "color",
          //       field: "color",
          //       defaultValue: "#601843",
          //       label: "Color",
          //       category: { id: "subheading", label: "Subheading", open: true },
          //     },
          //     {
          //       id: "subheadingFontSize",
          //       selector: "h2,h3",
          //       property: "font-size",
          //       field: {
          //         type: "number",
          //         min: 0.5,
          //         max: 4,
          //         step: 0.1,
          //         units: ["rem"],
          //       },
          //       defaultValue: "1.2rem",
          //       label: "Font Size",
          //       category: { id: "subheading", label: "Subheading" },
          //     },
          //     {
          //       id: "subheadingLineHeight",
          //       selector: "h2,h3",
          //       property: "line-height",
          //       field: {
          //         type: "number",
          //         min: 1,
          //         max: 3,
          //         step: 0.1,
          //         units: ["rem"],
          //       },
          //       defaultValue: "1.75rem",
          //       label: "Line Height",
          //       category: { id: "subheading", label: "Subheading" },
          //     },
          //     {
          //       id: "subheadingFontFamily",
          //       selector: "h2,h3",
          //       property: "font-family",
          //       field: {
          //         type: "select",
          //         options: [
          //           { id: "Default", label: "Default" },
          //           { id: "Arial, sans-serif", label: "Arial" },
          //           { id: "Inter, sans-serif", label: "Inter" },
          //           { id: "futura-pt, sans-serif", label: "Futura PT" },
          //           { id: "futura-pt-bold, serif", label: "Futura PT Bold" },
          //           { id: "questa-grande, serif", label: "Questa Grande" },
          //           { id: "Outfit, sans-serif", label: "Outfit" },
          //         ],
          //       },
          //       defaultValue: "Outfit, sans-serif",
          //       label: "Font Family",
          //       category: { id: "subheading", label: "Subheading" },
          //     },

          //     // ── BUTTONS ──
          //     {
          //       id: "buttonBackground",
          //       selector: "button",
          //       // selector: "button .btn-primary", //We can also use class name to select the button and to pass multiple classes
          //       property: "background-color",
          //       field: "color",
          //       defaultValue: "var(--gjs-pn-col1)",
          //       label: "Background",
          //       category: { id: "buttons", label: "Buttons", open: true },
          //     },
          //     {
          //       id: "buttonColor",
          //       selector: "button",
          //       property: "color",
          //       field: "color",
          //       defaultValue: "white",
          //       label: "Color",
          //       category: { id: "buttons", label: "Buttons" },
          //     },
          //     {
          //       id: "buttonRadius",
          //       selector: "button",
          //       property: "border-radius",
          //       field: {
          //         type: "select",
          //         options: [
          //           { id: "inherit", label: "Inherit" },
          //           { id: "4px", label: "Small" },
          //           { id: "8px", label: "Medium" },
          //           { id: "9999px", label: "Round" },
          //         ],
          //       },
          //       defaultValue: "inherit",
          //       label: "Border Radius",
          //       category: { id: "buttons", label: "Buttons" },
          //     },

          //     // ── LINKS ──
          //     {
          //       id: "linkColor",
          //       selector: "a",
          //       property: "color",
          //       field: "color",
          //       defaultValue: "var(--gjs-t-colc)",
          //       label: "Color",
          //       category: { id: "links", label: "Links", open: true },
          //     },
          //     {
          //       id: "linkDecoration",
          //       selector: "a",
          //       property: "text-decoration",
          //       field: {
          //         type: "select",
          //         options: [
          //           { id: "none", label: "None" },
          //           { id: "underline", label: "Underline" },
          //           { id: "overline", label: "Overline" },
          //           { id: "line-through", label: "Line through" },
          //         ],
          //       },
          //       defaultValue: "none",
          //       label: "Decoration",
          //       category: { id: "links", label: "Links" },
          //     },
          //     //Commented because it will handle through tailwind config
          //     {
          //       id: "linkHoverColor",
          //       selector: ":root",
          //       property: "--link-hover-color",
          //       field: "color",
          //       defaultValue: "#000000",
          //       label: "Link Hover Color",
          //       category: { id: "links", label: "Links" },
          //     },

          //     // ── BORDERS ──
          //     {
          //       id: "borderColor",
          //       selector: "*",
          //       property: "border-color",
          //       field: "color",
          //       defaultValue: "#ffffff",
          //       label: "Border Color",
          //       category: { id: "borders", label: "Borders" },
          //     },

          //     // ── LAYOUT ──
          //     {
          //       id: "gjsContainerMaxWidth",
          //       selector: "body .gjs-container",
          //       property: "max-width",
          //       field: {
          //         type: "number",
          //         units: ["px"],
          //         min: 0,
          //         step: 1,
          //       },
          //       defaultValue: "1600px",
          //       label: "GJS Container Max Width",
          //       category: { id: "layout", label: "Layout", open: true },
          //     },

          //     {
          //       id: "gjsContainerWidth",
          //       selector: "body .gjs-container",
          //       property: "width",
          //       field: {
          //         type: "number",
          //         units: ["%"],
          //         min: 0,
          //         step: 1,
          //       },
          //       defaultValue: "100%",
          //       label: "GJS Container Width",
          //       category: { id: "layout", label: "Layout" },
          //     },
          //   ],
          // },
        }}
      />

      {tabModal && (
        <AddTabModal
          isOpen={tabModal}
          onClose={() => setTabModal(false)}
          onSubmit={formInitialValues ? handleUpdateTab : handleAddTab}
          formInitialValues={formInitialValues}
          handleDelete={handleDeleteTab}
          tabDisplay={"yes"}
          showTabName={showTabName}
          selectedTag={selectedTag}
          storeId={storeId || ""}
        />
      )}

      {imageCountModal && (
        <ImageCountModal
          isOpen={imageCountModal}
          onClose={() => setImageCountModal(false)}
          onSubmit={handleImageCountSubmit}
          title={`Enter Number of Images for ${selectedBrandTab}`}
          onDelete={handleDeleteBrandTab}
          tabName={selectedBrandTab}
        />
      )}

      {brandTabNameModal && (
        <BrandTabNameModal
          isOpen={brandTabNameModal}
          onClose={() => setBrandTabNameModal(false)}
          onSubmit={handleBrandTabNameSubmit}
          title="Enter Brand Tab Name"
        />
      )}

      {photoEditingModalType && (
        <AddRdMacTab
          isOpen={!!photoEditingModalType}
          onClose={() => setPhotoEditingModalType(null)}
          onSubmit={handleAddUpdatePhotoEditingSection}
          editor={editorRef.current as Editor}
          formInitialValues={selectedPhotoEditingSection || ""}
          handleDelete={handleDeletePhotoEditingSection}
        />
      )}
    </div>
  );
};

export default StudioPageEditor;
