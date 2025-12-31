/* eslint-disable */
import Button from "@/components/Button/Button";
// import Dropdown from "@/components/DropDown/DropDown";
// import { Image } from "@/components/Image/Image";
import { InputWithProps } from "@/components/Input/input";
// import { Label } from "@/components/Label/Label";
import CommonModelComponent from "@/components/Modal/CommonModelComponent";
// import SvgIcon from "@/components/SvgIcons/SvgIcon";
import { TabsWithProps } from "@/components/Tabs/Tabs";
// import TablePagination from "@/components/Table/TablePagination/TablePagination";
// import TextWithProps from "@/components/Text/Text";
import { MAXIMUMITEMSFORFETCH } from "@/constants/cms/featureProducts";
// import {
//   fetchBrandOpts,
//   fetchCategoryOpts,
//   fetchFeatureProductByCategoryAndBrand,
//   fetchFeatureProductsManual,
// } from "@/services/content-management/content-builder/featureProducts.service";
import { IFeaturedProduct } from "@/types/content-management/content-builder/featuredProduct.type";
import { paginationDetails } from "@/utils/constants";
import { useDebounce } from "@/components/Debounce";
import { addTabValidationSchema } from "@/utils/validations/content-management/addTab.validation";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader } from "@/components/Loader/Loader";
import { ButtonWithProps } from "../Button/Button";
import { Search } from "lucide-react";

interface AddTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    tabName: string,
    selectedProducts: any[],
    displayMethod: string,
    productType: string,
    selectedDynamicValue: any,
    maximumItemsForFetch: number
  ) => void;
  formInitialValues?: any;
  handleDelete: (tabName: string) => void;
  tabDisplay: any;
  showTabName: boolean;
  selectedTag: string;
  storeId: string;
}

export const MANUAL_FEATURED_PRODUCTS_TABS = [
  { id: 1, label: "All Products", content: null },
  { id: 2, label: "Selected Products", content: null },
];

const AddTabModal = ({
  isOpen,
  onClose,
  onSubmit,
  formInitialValues,
  handleDelete,
  tabDisplay,
  showTabName,
  selectedTag,
  storeId,
}: AddTabModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryOpts, setCategoryOpts] = useState<any[]>([]);
  const [brandOpts, setBrandOpts] = useState<any[]>([]);
  const [manualFeaturedProducts, setManualFeaturedProducts] = useState<IFeaturedProduct[]>([]);
  const [pagination, setPagination] = useState({ ...paginationDetails });
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      if (categoryOpts.length === 0 && brandOpts.length === 0) {
        fetchCategoryAndBrandOpts();
      }
      if (formInitialValues) {
        setSelectedProducts(formInitialValues.products);
      }
    }
  }, [isOpen]);

  const fetchManualFeaturedProducts = async (
    pageNumber: number,
    pageSize: number,
    value: string
  ) => {
    try {
      setIsLoading(true);
      let payload = {
        args: {
          isRefresh: pageNumber === 1 ? true : false,
          pageIndex: pageNumber,
          pageSize: pageSize || pagination.itemsPerPage,
          pagingStrategy: 0,
          sortingOptions: [
            {
              field: "name",
              direction: 0,
              priority: 0,
            },
          ],
          filteringOptions: [
            {
              field:
                (value && value !== "") || (globalFilter && globalFilter !== "")
                  ? "global"
                  : "recStatus",
              operator: 0,
              value:
                value && value !== ""
                  ? value
                  : globalFilter && globalFilter !== ""
                    ? globalFilter
                    : "A",
            },
            {
              field: "storeId",
              operator: 0,
              value: `${storeId}`,
            },
          ],
        },
      };
      // let response = await fetchFeatureProductsManual(payload);
      let response = {
        items: [],
        pageNumber: 1,
        pageSize: 25,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      setManualFeaturedProducts(response?.items);
      setPagination((prevState) => ({
        ...prevState,
        pageNumber: response?.pageNumber,
        pageSize: response?.pageSize,
        totalCount: response?.totalCount,
        totalPages: response?.totalPages,
        hasPreviousPage: response?.pageNumber > 1,
        hasNextPage: response?.pageNumber < response?.totalPages,
      }));
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const setPaginationDataFunc = (key: keyof typeof paginationDetails, value: number) => {
    setPagination((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    fetchManualFeaturedProducts(1, value, globalFilter);
  };

  // Debounce globalFilter value
  const { debouncedValue: debouncedGlobalFilter } = useDebounce(globalFilter, { delay: 1000 });

  // Call fetchManualFeaturedProducts when debounced value changes
  useEffect(() => {
    if (debouncedGlobalFilter !== undefined) {
      fetchManualFeaturedProducts(1, 25, debouncedGlobalFilter);
    }
  }, [debouncedGlobalFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter?.(value);
  };

  const fetchCategoryAndBrandOpts = async () => {
    try {
      setIsLoading(true);
      const categoryPayload = {
        args: {
          pageIndex: 1,
          pageSize: 0,
          isRefresh: true,
          pagingStrategy: 0,
          sortingOptions: [],
          filteringOptions: [
            {
              field: "storeid",
              operator: 0,
              value: `${storeId}`,
            },
          ],
        },
      };
      // let categoryResponse = await fetchCategoryOpts(categoryPayload);
      let categoryResponse = {
        items: [],
        pageNumber: 1,
        pageSize: 25,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      setCategoryOpts(
        categoryResponse?.items.map((item: any) => ({
          value: item?.categories?.sename,
          label: item?.categories?.name,
        }))
      );
      let brandPayload = {
        args: {
          pageIndex: 1,
          pageSize: 0,
          isRefresh: true,
          pagingStrategy: 0,
          sortingOptions: [],
          filteringOptions: [
            {
              field: "storeId",
              operator: 0,
              value: `${storeId}`,
            },
          ],
        },
      };
      // let brandResponse = await fetchBrandOpts(brandPayload);
      let brandResponse = {
        items: [],
        pageNumber: 1,
        pageSize: 25,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      setBrandOpts(
        brandResponse?.items.map((item: any) => ({
          value: item?.seName,
          label: item?.name,
        }))
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const showSelectedProducts = () => {
    return (
      <>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 cursor-pointer 
             border-blue-500 bg-blue-50
            `}
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex-1">
                <div className="relative w-full h-40 mb-2">
                  {/* <Image
                    src={`https://storagemedia.corporategear.com${product?.productImage[0]}`}
                    alt={product?.name}
                    className="w-full h-full object-contain"
                    variant="next"
                    width={200}
                    height={200}
                  /> */}
                </div>
                <div className="flex flex-col items-center text-center">
                  {/* <Text size="sm" className="font-medium mb-1"> */}
                  <div className="font-medium mb-1">{product?.name}</div>
                  {/* </Text> */}
                  {/* <Text
                    size="xs"
                    className="text-quaternary-light dark:text-quaternary-dark mb-1"
                  > */}
                  <div className="text-quaternary-light dark:text-quaternary-dark mb-1">
                    {product?.brandName}
                  </div>
                  {/* </Text> */}
                  {/* <Text size="sm" className="font-bold"> */}
                  <div className="font-bold">${product?.salePrice}</div>
                  {/* </Text> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const allProducts = () => {
    return (
      <>
        <div className="relative grow">
          {/* <Label htmlFor="table-search" className="sr-only">
            Search
          </Label> */}
          <InputWithProps
            id="table-search"
            name="search"
            type="text"
            placeholder="Search..."
            label="Search"
            labelClassName="sr-only"
            formik={false}
            value={globalFilter || ""}
            onChange={handleInputChange}
            className="p-2"
          />
          <div className="absolute inset-y-0 end-2 h-10 flex items-center pe-3 pointer-events-none">
            <Search />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {manualFeaturedProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedProducts.some((p) => p?.id === product?.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex-1">
                <div className="relative w-full h-40 mb-2">
                  {/* <Image
                    src={`https://storagemedia.corporategear.com${product?.imageUrl}`}
                    alt={product?.name}
                    className="w-full h-full object-contain"
                    variant="next"
                    width={200}
                    height={200}
                  /> */}
                </div>
                <div className="flex flex-col items-center text-center">
                  {/* <Text size="sm" className="font-medium mb-1"> */}
                  <div className="font-medium mb-1">{product?.name}</div>
                  {/* </Text> */}
                  <div className="text-quaternary-light dark:text-quaternary-dark mb-1">
                    {product?.brandName}
                  </div>
                  <div className="font-bold">${product?.salePrice}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* {pagination.totalCount > 0 && (
          <TablePagination
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            totalPages={Math.ceil(pagination.totalCount / pagination.pageSize)}
            pageNumber={pagination.pageNumber}
            setTablePageSize={(value: number) => {
              setPaginationDataFunc("pageSize", value);
            }}
            hasPreviousPage={pagination.hasPreviousPage}
            hasNextPage={pagination.hasNextPage}
            hasPageSize={pagination.hasPageSize}
            fetchData={fetchManualFeaturedProducts}
            onGotoPage={false}
          />
        )} */}
      </>
    );
  };

  const handleProductSelect = (product: any) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p?.id === product?.id);
      if (isSelected) {
        return prev.filter((p) => p?.id !== product?.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const initialValues = {
    tabName: formInitialValues?.tabName || (showTabName ? "" : "None"),
    selectionType: formInitialValues?.displayMethod || "dynamic",
    dynamicType: formInitialValues?.productType || "category",
    selectedDynamicValue: formInitialValues?.selectedDynamicValue?.value
      ? formInitialValues?.selectedDynamicValue?.value?.split(",")
      : formInitialValues?.selectedDynamicValue || "",
    maximumItemsForFetch: formInitialValues
      ? MAXIMUMITEMSFORFETCH.find((item) => item.value === formInitialValues?.maximumItemsForFetch)
      : null,
  };

  const handleSubmit = async (values: any) => {
    try {
      if (values.selectionType === "manual" && selectedProducts.length < 2) {
        toast.error("Minimum 2 products are required");
        return;
      }

      if (values.selectionType === "dynamic") {
        let dynamicProdPayload = {
          sename: values.selectedDynamicValue?.join(","),
          type: values.dynamicType === "category" ? "Category" : "Brand",
          storeId: +storeId, // need to make it dynamic
          maximumItemsForFetch: values.maximumItemsForFetch?.value
            ? +values.maximumItemsForFetch?.value
            : 0,
          tagName: selectedTag,
        };
        // let dynamicFeatProds = await fetchFeatureProductByCategoryAndBrand(dynamicProdPayload);
        let dynamicFeatProds = {
          items: [],
          pageNumber: 1,
          pageSize: 25,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
          length: 0,
        };

        if (dynamicFeatProds.length < 4) {
          toast.error("No products found or less than 4 products found");
          return;
        }

        const selectedDynamicValue = {
          value: values.selectedDynamicValue?.join(","),
          label: values.dynamicType,
        };
        onSubmit(
          values.tabName.trim() || "",
          // dynamicFeatProds, // from pk
          dynamicFeatProds.items,
          values.selectionType,
          values.dynamicType,
          selectedDynamicValue,
          values.maximumItemsForFetch.value
        );
      } else {
        onSubmit(
          values.tabName.trim() || "",
          selectedProducts,
          values.selectionType,
          values.dynamicType,
          values.selectedDynamicValue,
          selectedProducts.length
        );
      }

      setSelectedProducts([]);
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const content = (
    <Formik
      initialValues={initialValues}
      validationSchema={addTabValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) =>
        isLoading ? (
          <Loader />
        ) : (
          <>
            <Form id="addTabForm" className="flex flex-col flex-1 h-full">
              <div className="flex flex-col gap-4 mb-4 flex-1">
                {tabDisplay === "yes" && (
                  <div className="flex-1">
                    <Field
                      as={InputWithProps}
                      disabled={!showTabName || formInitialValues}
                      name="tabName"
                      label="Tab Name"
                      placeholder="Enter tab name"
                      formik={true}
                      autoFocus
                    />
                  </div>
                )}
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <Field
                      type="radio"
                      name="selectionType"
                      onChange={() => {
                        setSelectedProducts([]);
                        setFieldValue("selectionType", "dynamic");
                      }}
                      value="dynamic"
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Dynamic</span>
                  </label>
                  <label className="inline-flex items-center">
                    <Field
                      type="radio"
                      name="selectionType"
                      onChange={() => {
                        setSelectedProducts([]);
                        setFieldValue("selectionType", "manual");
                        fetchManualFeaturedProducts(1, 25, "");
                      }}
                      value="manual"
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Manual</span>
                  </label>
                </div>

                {values.selectionType === "dynamic" && (
                  <div className="flex flex-col gap-4 mt-2 flex-1">
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          name="dynamicType"
                          onChange={() => {
                            setSelectedProducts([]);
                            setFieldValue("dynamicType", "category");
                            setFieldValue("selectedDynamicValue", []);
                          }}
                          value="category"
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Category</span>
                      </label>
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          name="dynamicType"
                          onChange={() => {
                            setSelectedProducts([]);
                            setFieldValue("dynamicType", "brand");
                            setFieldValue("selectedDynamicValue", []);
                          }}
                          value="brand"
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Brand</span>
                      </label>
                    </div>
                    <div className="relative z-20">
                      {/* <Dropdown
                        key={values.dynamicType}
                        defaultValue={
                          values?.selectedDynamicValue ||
                          formInitialValues?.selectedDynamicValue
                        }
                        options={
                          values?.dynamicType == "category"
                            ? categoryOpts
                            : brandOpts
                        }
                        onChange={(selected: any) => {
                          setFieldValue(
                            "selectedDynamicValue",
                            selected?.length
                              ? selected?.map((item: any) => item.value)
                              : []
                          );
                        }}
                        placeholder={`Select ${values.dynamicType}`}
                        label={`Select ${values.dynamicType}`}
                        isMulti
                      /> */}
                      {errors.selectedDynamicValue && touched.selectedDynamicValue && (
                        <div className="text-red-500 text-sm mt-1">
                          {`${errors.selectedDynamicValue}`}
                        </div>
                      )}
                    </div>

                    <div className="relative z-15">
                      {/* <Dropdown
                        key={values?.maximumItemsForFetch?.value}
                        defaultValue={
                          values?.maximumItemsForFetch?.value ||
                          formInitialValues?.maximumItemsForFetch.value
                        }
                        options={MAXIMUMITEMSFORFETCH}
                        onChange={(selected: any) => {
                          setFieldValue("maximumItemsForFetch", selected);
                        }}
                        placeholder={`Select Maximum Items For Fetch`}
                        label={`Select Maximum Items For Fetch`}
                      /> */}
                      {errors.maximumItemsForFetch && touched.maximumItemsForFetch && (
                        <div className="text-red-500 text-sm mt-1">
                          {`${errors.maximumItemsForFetch}`}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {values.selectionType === "manual" && (
                  <>
                    <TabsWithProps
                      options={MANUAL_FEATURED_PRODUCTS_TABS}
                      // usedInsideModal={true}
                      // activeTab={activeTab}
                      onTabClick={(tabId: any) => setActiveTab(tabId)}
                    />
                    {activeTab === 1 ? allProducts() : showSelectedProducts()}
                  </>
                )}
              </div>
            </Form>
          </>
        )
      }
    </Formik>
  );

  return (
    <CommonModelComponent
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`${formInitialValues ? "Update" : "Add"} Tab`}
      content={content}
      footer={
        <div className="flex justify-end gap-2">
          <ButtonWithProps variant="default" onClick={onClose}>
            Cancel
          </ButtonWithProps>
          {formInitialValues && (
            <Button
              variant="secondary"
              onClick={() => {
                handleDelete(formInitialValues.tabName);
                onClose();
              }}
            >
              Delete
            </Button>
          )}
          <ButtonWithProps variant="default" type="submit" form="addTabForm">
            {`${formInitialValues ? "Update" : "Add"} Tab`}
          </ButtonWithProps>
        </div>
      }
    />
  );
};

export default AddTabModal;
