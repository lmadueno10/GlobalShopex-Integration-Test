import React, { useState } from "react";
import {
    Tabs,
    Tab,
    TextField,
    Box,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Typography,
    InputAdornment,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import NV2HtmlEditor from "./NV2HtmlEditor";
import EditButton from "components/EditButton/EditButton";
import Button from "components/CustomButtons/Button.js";
import { useConfirmationDialog } from "hooks/useConfirmationDialog";
import useDealer from "hooks/useDealer";
import { useSnackbar } from "hooks/useSnackbar";
import CustomPageService from "services/CustomPageService";

const options = [
    { value: "N", label: "None" },
    { value: "HF", label: "Show in Header & Footer" },
    { value: "H", label: "Show in Header Only" },
    { value: "F", label: "Show in Footer Only" },
];

const CreateCustomPageForm = ({
    isEditForm = false,
    defaultValues = {},
    dealerDomain = "",
    onRegistrationComplete = () => { },
}) => {
    const openSnackbar = useSnackbar();
    const { id: dealerId } = useDealer();

    const [tab, setTab] = useState("EN");
    const getFieldName = (field, lang) => `${lang.toLowerCase()}${field}`;

    const initialValues = {
        enableSection: false,
        enableSlider: false,
        sliderImageSrc: "",
        title: "",
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        pageContent: "",
        isVisible: true,
        enMetaTitle: "",
        esMetaTitle: "",
        ptMetaTitle: "",
        frMetaTitle: "",
        enMetaKeyword: "",
        esMetaKeyword: "",
        ptMetaKeyword: "",
        frMetaKeyword: "",
        enMetaDescription: "",
        esMetaDescription: "",
        ptMetaDescription: "",
        frMetaDescription: "",
        enTitle: "",
        esTitle: "",
        ptTitle: "",
        frTitle: "",
        enPageContent: "",
        esPageContent: "",
        ptPageContent: "",
        frPageContent: "",
        isActive: false,
        pagePosition: "N",
        menuTitle: "",
        pageUrl: "",
        ...defaultValues,
    };

    const handleAddCustomPage = async (pageData) => {
        try {
            await CustomPageService.post({ ...pageData, dealerId });
            openSnackbar("success", "Page inserted successfully.");
        } catch (error) {
            openSnackbar("error", "Error creating page.");
        }
    };

    const updateCustomPage = async (pageData) => {
        try {
            await CustomPageService.put({ ...pageData, dealerId });
            openSnackbar("success", "Page updated successfully.");
        } catch (error) {
            openSnackbar("error", "An error occurred while updating page. Please try again.");
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values) => {
                if (isEditForm) {
                    await updateCustomPage(values);
                } else {
                    await handleAddCustomPage(values);
                }

                onRegistrationComplete();
            }}
        >
            {({ values, handleChange, setFieldValue }) => (
                <Form>
                    <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
                        <Tab label="EN" value="EN" />
                        <Tab label="ES" value="ES" />
                        <Tab label="PT" value="PT" />
                        <Tab label="FR" value="FR" />
                    </Tabs>

                    {["EN", "ES", "PT", "FR"].map((lang) => (
                        <Box key={lang} mt={1} style={{ display: tab === lang ? "block" : "none" }}>
                            <Field
                                as={TextField}
                                label="Title"
                                name={getFieldName("Title", lang)}
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                                value={values[getFieldName("Title", lang)]}
                            />
                            <Field
                                as={TextField}
                                label="Meta Title"
                                name={getFieldName("MetaTitle", lang)}
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                                value={values[getFieldName("MetaTitle", lang)]}
                            />
                            <Field
                                as={TextField}
                                label="Meta Keywords"
                                name={getFieldName("MetaKeyword", lang)}
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                                value={values[getFieldName("MetaKeyword", lang)]}
                            />
                            <Field
                                as={TextField}
                                label="Meta Description"
                                name={getFieldName("MetaDescription", lang)}
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                                value={values[getFieldName("MetaDescription", lang)]}
                            />
                            <Box mt={2}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    style={{ textTransform: "none" }}
                                >
                                    Page content
                                </Typography>
                                {/* Integrated NV2HtmlEditor - works seamlessly with Formik */}
                                <NV2HtmlEditor
                                    value={values[getFieldName("PageContent", lang)]}
                                    onChange={(html) => setFieldValue(getFieldName("PageContent", lang), html)}
                                    height={250}
                                    dlid={dealerId}
                                />
                            </Box>
                        </Box>
                    ))}

                    <Box>
                        <FormControlLabel
                            control={
                                <Field
                                    as={Checkbox}
                                    name="isActive"
                                    color="primary"
                                    checked={values.isActive === 1}
                                    onChange={handleChange}
                                />
                            }
                            label="Active"
                        />
                    </Box>

                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>Page Position</InputLabel>
                            <Field as={Select} name="pagePosition">
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </Box>

                    <Box>
                        <Field
                            as={TextField}
                            label="Menu Title"
                            name="menuTitle"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={values.menuTitle}
                        />
                    </Box>

                    <Box>
                        <Field
                            as={TextField}
                            label="Page URL"
                            name="pageUrl"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={values.pageUrl}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {dealerDomain}/en/page/
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box textAlign="center">
                        <Button type="submit" color="rose">
                            Save and close
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

const CreateCustomPageV2 = ({
    isEditForm = false,
    defaultValues = {},
    onRegistrationComplete = () => { },
}) => {
    const { openDialog, closeDialog } = useConfirmationDialog();
    const { dealerDomain = "" } = useDealer();

    const handleOpenModal = () => {
        openDialog({
            customDialog: true,
            fullWidth: true,
            showClose: true,
            maxWidth: "md",
            title: "Edit custom page",
            message: (
                <Paper style={{ padding: 15, marginBottom: 15 }}>
                    <CreateCustomPageForm
                        isEditForm={isEditForm}
                        defaultValues={defaultValues}
                        closeDialog={closeDialog}
                        dealerDomain={dealerDomain}
                        onRegistrationComplete={() => {
                            closeDialog();
                            onRegistrationComplete();
                        }}
                    />
                </Paper>
            ),
        });
    };

    return (
        <>
            {isEditForm ? (
                <EditButton handleClick={handleOpenModal} />
            ) : (
                <Button color="primary" onClick={handleOpenModal}>
                    Add custom page
                </Button>
            )}
        </>
    );
};

export default CreateCustomPageV2;
