"use client";

import { useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";

import Input from "@/components/Input/CommonInput";
import { ComboboxWithProps } from "@/components/Combobox/ComboboxWithProps";

import { getAllCountries } from "@/services/countries/country.service";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import ChangePasswordForm from "../auth/ChangePassword";
import { ProfileSchema } from "@/utils/validations/settings/settings.schema";
import { useAppSelector } from "@/redux";
import { GetUser, UpdateUser } from "@/services/user/user.service";
import { UpdateUserPayload } from "@/types/user/user.types";
import { toast } from "react-toastify";

interface ProfileFormValues {
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  country: string;
  currency: string;
  theme: "light" | "dark";
  language: string;
}

export default function SettingsPage() {
  const { data: UsersData } = useQuery({
    queryKey: ["users"],
    queryFn: GetUser,
  });

  const { data: CountriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: getAllCountries,
  });

  const UpdateUsermutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => UpdateUser(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const initialValues: ProfileFormValues = {
    firstname: UsersData?.user?.firstname || "",
    lastname: UsersData?.user?.lastname || "",
    email: UsersData?.user?.email || "",
    contact: UsersData?.user?.contact || "",
    country: UsersData?.user?.country || "",
    currency: UsersData?.user?.currency || "",
    theme: UsersData?.user?.theme || "light",
    language: UsersData?.user?.language || "en",
  };

  return (
    <div className="max-w-4xl mx-auto xl:p-6 p-2 bg-surface border rounded-md shadow-xl">
      {/* PROFILE INFO */}
      <PageHeader title="General Settings" description="Profile Information" />
      <br />
      <hr />

      <div className="p-1 xl:p-5">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={(values) => {
            UpdateUsermutation.mutate(values);
          }}
        >
          {({ handleSubmit, values, setFieldValue,handleReset }) => {
            useEffect(() => {
              if (!values.country || !CountriesData) return;

              const selectedCountry = CountriesData.find(
                (c) => c.value === values.country
              );

              if (selectedCountry?.currencyCode) {
                setFieldValue("currency", selectedCountry.currencyCode);
              }
            }, [values.country, CountriesData]);
            /* ✅ CURRENCY OPTIONS (derived from country) */
            const currencyOptions = useMemo(() => {
              if (!values.currency) return [];
              return [{ label: values.currency, value: values.currency }];
            }, [values.currency]);

            return (
              <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-6">
                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    formik
                    label="First Name"
                    name="firstname"
                    placeholder="Enter Your First Name"
                    defaultValue={values.firstname}
                  />
                  <Input
                    formik
                    label="Last Name"
                    name="lastname"
                    placeholder="Enter Your Last Name"
                    defaultValue={values.lastname}
                  />

                  <Input
                    formik
                    label="Email Address"
                    name="email"
                    type="email"
                    disabled
                    defaultValue={values.email}
                  />
                  <Input
                    formik
                    label="Phone Number"
                    name="contact"
                    placeholder="Phone Number"
                    defaultValue={values.contact}
                  />

                  <ComboboxWithProps
                    formik
                    name="country"
                    label="Country"
                    placeholder="Select country"
                    defaultValue={values.country}
                    options={CountriesData || []}
                  />

                  <ComboboxWithProps
                    formik
                    name="currency"
                    label="Currency"
                    placeholder="Select Currency"
                    defaultValue={values.currency}
                    options={currencyOptions}
                  />

                  {/* APPEARANCE */}
                  <div className="flex flex-col md:flex-wrap gap-2">
                    <h2 className="text-xl text-bold m-0">Appearance</h2>
                    <p>Customize how your theme looks on your device.</p>
                    <ComboboxWithProps
                      formik
                      name="theme"
                      label="Theme"
                      // defaultValue={values.theme}
                      options={[
                        { label: "Light", value: "light" },
                        { label: "Dark", value: "dark" },
                      ]}
                    />
                  </div>

                  {/* LANGUAGE */}
                  <div className="flex flex-col md:flex-wrap gap-2">
                    <h2 className="text-xl text-bold m-0">Language</h2>
                    <p>Customize what language you want to use.</p>
                    <ComboboxWithProps
                      formik
                      name="language"
                      label="Language"
                      placeholder="select Language"
                      // defaultValue={values.language}
                      options={[
                        { label: "English", value: "en" },
                        { label: "Hindi", value: "hi" },
                      ]}
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="reset">
                    Reset   
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Save
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>

        <br />
        <hr />

        <ChangePasswordForm />
      </div>
    </div>
  );
}
