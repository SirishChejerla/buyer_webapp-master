const individualSubmitParser = ({ values, documents }) => {
  return {
    authorised_financier_user_attributes: {
      person_attributes: {
        user_attributes: {
          full_name: values?.fullName,
          email: values?.email,
          phone: values?.mobile,
        },
        person_kyc_attributes: {
          permanent_account_number: values?.pan,
          date_of_birth: values?.dob,
          aadhaar_number: values?.aadhaar,
          e_aadhaar_password: values?.aadhaarPassword,
        },
      },
    },
    documents: {
      document_pan_card_id: documents?.panDocument?.id,
      document_aadhaar_card_id: documents?.aadhaarDocument?.id,
      document_gstn_id: documents?.gstnDocument?.id,
    },
    financier_type: 'individual',
    referral_code: values?.referralCode,
    has_gstn: values?.hasGSTN,
    gst_number: values?.gstn,
    address: values?.address,
    location: values?.location,
    pin_code: values?.pincode,
    agreed_to_terms_and_conditions: values?.termsAndConditions,
  }
}

const nriSubmitParser = ({ values, documents }) => {
  return {
    authorised_financier_user_attributes: {
      person_attributes: {
        user_attributes: {
          full_name: values?.fullName,
          email: values?.email,
          phone: values?.mobile,
          country_code: values?.countryCode,
        },
        person_kyc_attributes: {
          permanent_account_number: values?.pan,
          date_of_birth: values?.dob,
        },
      },
    },
    documents: {
      document_pan_card_id: documents?.panDocument?.id,
      document_nri_proof_id: documents?.nroDocument?.id,
      document_phone_bill_id: documents?.phoneBillDocument?.id,
      document_gstn_id: documents?.gstnDocument?.id,
    },
    financier_type: 'nri',
    referral_code: values?.referralCode,
    has_gstn: values?.hasGSTN,
    gst_number: values?.gstn,
    address: values?.address,
    location: values?.location,
    pin_code: values?.pincode,
    agreed_to_terms_and_conditions: values?.termsAndConditions,
  }
}

// TODO Untested
const hufSubmitParser = ({ values, documents }) => {
  return {
    organisation_attributes: {
      name: values?.entityName,
      date_of_incorporation: values?.dof,
      organisation_kyc_attributes: {
        permanent_account_number: values?.entityPan,
        gst_number: values?.gstn,
      },
    },
    authorised_financier_user_attributes: {
      person_attributes: {
        user_attributes: {
          full_name: values?.fullName,
          email: values?.email,
          phone: values?.mobile,
          country_code: values?.countryCode,
        },
        person_kyc_attributes: {
          permanent_account_number: values?.pan,
          date_of_birth: values?.dob,
          aadhaar_number: values?.aadhaar,
          e_aadhaar_password: values?.aadhaarPassword,
        },
      },
    },
    documents: {
      organisation_document_pan_card_id: documents?.entityPanDocument?.id,
      organisation_document_gstn_id: documents?.gstnDocument?.id,
      // Check below Key
      document_pan_card_id: documents?.panDocument?.id,
      document_aadhaar_card_id: documents?.aadhaarDocument?.id,
    },
    referral_code: values?.referralCode,
    has_gstn: values?.hasGSTN,
    address: values?.address,
    location: values?.location,
    pin_code: values?.pincode,
    agreed_to_terms_and_conditions: values?.termsAndConditions,
  }
}

export const registerSubmitParsers = (type, data) => {
  // TODO support more account types including huf
  switch (type) {
    case 'individual':
      return individualSubmitParser(data)
    case 'nri':
      return nriSubmitParser(data)
    case 'huf':
      return hufSubmitParser(data)
    default:
      break
  }
}
