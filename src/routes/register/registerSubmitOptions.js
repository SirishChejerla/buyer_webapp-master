const gstnAttributes = {
  hasGSTN: 'has_gstn',
  gstn: 'gst_number',
  address: 'address',
  location: 'location',
  pincode: 'pin_code',
}

const orgGSTNAttributes = {
  hasGSTN: 'has_gstn',
  gstn: 'organisation_attributes.organisation_kyc_attributes.gst_number',
  address: 'address',
  location: 'location',
  pincode: 'pin_code',
}

const individual = {
  required: [
    'fullName',
    'email',
    'dob',
    'pan',
    'aadhaar',
    'mobile',
    'aadhaarPassword',
    'termsAndConditions',
    'panDocument',
    'aadhaarDocument',
  ],
  optional: ['referralCode', 'hasGSTN', 'gstn', 'address', 'location', 'pincode', 'gstnDocument'],
  minimumAttributes: ['fullName', 'email', 'dob', 'pan', 'aadhaar', 'mobile', 'aadhaarPassword', 'termsAndConditions'],
  documents: ['panDocument', 'aadhaarDocument', 'gstnDocument'],
}

const nri = {
  required: [
    'fullName',
    'email',
    'dob',
    'pan',
    'countryCode',
    'mobile',
    'termsAndConditions',
    'panDocument',
    'phoneBillDocument',
    'nroDocument',
  ],
  optional: ['referralCode', 'hasGSTN', 'gstn', 'address', 'location', 'pincode', 'gstnDocument'],
  minimumAttributes: ['fullName', 'email', 'dob', 'pan', 'countryCode', 'mobile', 'termsAndConditions'],
  documents: ['panDocument', 'phoneBillDocument', 'nroDocument', 'gstnDocument'],
}

const authorizedUserAttributes = {
  fullName: 'authorised_financier_user_attributes.person_attributes.user_attributes.full_name',
  email: 'authorised_financier_user_attributes.person_attributes.user_attributes.email',
  dob: 'authorised_financier_user_attributes.person_attributes.person_kyc_attributes.date_of_birth',
  pan: 'authorised_financier_user_attributes.person_attributes.person_kyc_attributes.permanent_account_number',
  aadhaar: 'authorised_financier_user_attributes.person_attributes.person_kyc_attributes.aadhaar_number',
  mobile: 'authorised_financier_user_attributes.person_attributes.user_attributes.phone',
  aadhaarPassword: 'authorised_financier_user_attributes.person_attributes.person_kyc_attributes.e_aadhaar_password',
  referralCode: 'referral_code',
}

const authorizedUserDocuments = {
  entityPanDocument: 'documents.organisation_document_pan_card_id',
  aadhaarDocument: 'documents.document_aadhaar_card_id',
}

const huf = {
  attributes: {
    entityName: 'organisation_attributes.name',
    dof: 'organisation_attributes.date_of_incorporation',
    entityPan: 'organisation_attributes.organisation_kyc_attributes.permanent_account_number',
    ...orgGSTNAttributes,
    ...authorizedUserAttributes,
  },
  documents: {
    hufPanDocument: 'documents.organisation_document_pan_card_id',
    gstnDocument: 'documents.organisation_document_gstn_id',
    ...authorizedUserDocuments,
  },
}

// TODO LLP & Company

export const registerSubmitOptions = {
  individual: individual,
  nri: nri,
  huf: huf,
}

export const documentSubmitParser = type => {
  const mapping = {
    panDocument: 'DocumentPanCard',
    entityPanDocument: 'DocumentPanCard',
    aadhaarDocument: 'DocumentAadhaarCard',
    phoneBillDocument: 'DocumentPhoneBill',
    nroDocument: 'DocumentNriProof',
    gstnDocument: 'DocumentGstn',
    registrationDocument: 'DocumentCertificateOfIncorporation',
    partnershipDocument: 'DocumentPartnershipDeed',
    resolutionDocument: 'DocumentAnnexureA',
  }

  return mapping[type]
}
