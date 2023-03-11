const individual = {
  type: 'individual',
  title: 'Individual',
  description: 'If you are an Indian resident investor',
  attributesTitle: 'Provide your details',
  attributesDescription: 'to process your KYC',
  attributes: [
    {
      type: 'fullName',
      title: 'Full Name',
      placeholder: 'Name as per PAN',
      description: 'Must be exactly same as per your PAN',
      input: 'text',
    },
    {
      type: 'email',
      title: 'Email Address',
      placeholder: 'Your email address',
      input: 'email',
    },
    {
      type: 'dob',
      title: 'Date of Birth',
      input: 'date',
    },
    {
      type: 'pan',
      title: 'PAN',
      placeholder: 'Your Permanent Account Number (PAN)',
      description: 'PAN will be your userID to access TradeCred',
      input: 'text',
    },
    {
      type: 'aadhaar',
      title: 'Aadhaar Number',
      placeholder: 'Your Aadhaar Number',
      input: 'text',
    },
    {
      type: 'mobile',
      title: 'Mobile Number',
      placeholder: 'Aadhaar registered mobile number',
      description: 'Must be same as the one registered in your Aadhaar',
      input: 'tel',
    },
    {
      type: 'referralCode',
      title: 'Referral Code',
      placeholder: 'Enter referral code',
      description: 'Referral code will be in the format of TC123456',
      input: 'text',
    },
    {
      type: 'aadhaarPassword',
      title: 'E-Aadhaar Password',
      placeholder: 'Password format - TRAD2018',
      description:
        'Password will be 4 letter of your first name (TradeCred — TRAD) followed by full year of birth (2018) ',
      input: 'text',
    },
  ],
  documents: [
    { type: 'panDocument', title: 'PAN Card', description: 'Front side of PAN Card should be legibly visible' },
    {
      type: 'aadhaarDocument',
      title: 'E-Aadhaar Card',
      description: 'Aadhaar Number MUST NOT be masked and must contain your phone number(Below Address)',
      extraDescription: {
        title: 'E-Aadhaar card can be downloaded from',
        linkTitle: 'myaadhaar.uidai.gov.in',
        link: 'https://myaadhaar.uidai.gov.in/genricDownloadAadhaar',
      },
    },
  ],
}

const nri = {
  type: 'nri',
  title: 'NRI',
  description: 'If you are a Non-Resident Indian (NRI)',
  attributesTitle: 'Provide your NRI details',
  attributesDescription: 'to process your KYC',
  attributes: [
    {
      type: 'fullName',
      title: 'Full Name',
      placeholder: 'Name as per PAN',
      input: 'text',
    },
    {
      type: 'email',
      title: 'Email Address',
      placeholder: 'Your email address',
      input: 'email',
    },
    {
      type: 'dob',
      title: 'Date of Birth',
      input: 'date',
    },
    {
      type: 'pan',
      title: 'PAN',
      placeholder: 'Your Permanent Account Number (PAN)',
      description: 'PAN will be your userID to access TradeCred',
      input: 'text',
    },
    {
      type: 'countryCode',
      title: 'Country code',
      placeholder: '+1',
      description: 'Number: +1 310-276-2251 has country code: +1',
      input: 'tel',
    },
    {
      type: 'mobile',
      title: 'Mobile Number',
      placeholder: '10 digit mobile number',
      input: 'tel',
    },
    {
      type: 'referralCode',
      title: 'Referral Code',
      placeholder: 'Enter referral code',
      description: 'Referral code will be in the format of TC123456',
      input: 'text',
    },
  ],
  documents: [
    { type: 'panDocument', title: 'PAN Card', description: 'Front side of PAN Card should be legibly visible' },
    { type: 'nroDocument', title: 'NRI Proof (NRO)' },
    { type: 'phoneBillDocument', title: 'Recent Phone Bill' },
  ],
}

const authorizedUserAttributes = [
  {
    type: 'fullName',
    title: 'Full Name',
    placeholder: 'Name as per PAN',
    description: 'Must be exactly same as per your PAN',
    input: 'text',
  },
  {
    type: 'email',
    title: 'Email Address',
    placeholder: 'Your email address',
    input: 'email',
  },
  {
    type: 'mobile',
    title: 'Mobile Number',
    placeholder: 'Aadhaar registered mobile number',
    description: 'Must be same as the one registered in your Aadhaar',
    input: 'tel',
  },
  {
    type: 'dob',
    title: 'Date of Birth',
    input: 'date',
  },
  {
    type: 'pan',
    title: 'PAN',
    placeholder: 'Your Permanent Account Number (PAN)',
    description: 'PAN will be your userID to access TradeCred',
    input: 'text',
  },
  {
    type: 'aadhaar',
    title: 'Aadhaar Number',
    placeholder: 'Your Aadhaar Number',
    input: 'text',
  },
  {
    type: 'referralCode',
    title: 'Referral Code',
    placeholder: 'Enter referral code',
    description: 'Referral code will be in the format of TC123456',
    input: 'text',
  },
  {
    type: 'aadhaarPassword',
    title: 'E-Aadhaar Password',
    placeholder: 'Password format - TRAD2018',
    description:
      'Password will be 4 letter of your first name (TradeCred — TRAD) followed by full year of birth (2018) ',
    input: 'text',
  },
]

const authorizedUserDocuments = [
  { type: 'panDocument', title: 'PAN Card', description: 'Front side of PAN Card should be legibly visible' },
  {
    type: 'aadhaarDocument',
    title: 'E-Aadhaar Card',
    description: 'Aadhaar Number MUST NOT be masked and must contain your phone number(Below Address)',
    extraDescription: {
      title: 'E-Aadhaar card can be downloaded from',
      linkTitle: 'myaadhaar.uidai.gov.in',
      link: 'https://myaadhaar.uidai.gov.in/genricDownloadAadhaar',
    },
  },
]

const huf = {
  type: 'huf',
  title: 'HUF',
  description: 'If you are a Hindu Undivided Family',
  attributesTitle: 'Provide your HUF details',
  attributes: [
    {
      type: 'entityName',
      title: 'HUF Name',
      placeholder: 'Name',
      input: 'text',
    },
    {
      type: 'dof',
      title: 'Date of Formation',
      input: 'date',
    },
    {
      type: 'entityPan',
      title: 'PAN',
      placeholder: 'Permanent Account Number (PAN)',
      input: 'text',
    },
  ],
  documents: [
    {
      type: 'entityPanDocument',
      title: 'HUF PAN Card',
      description: 'Front side of PAN Card should be legibly visible',
    },
  ],
  authorizedUser: {
    type: 'karta',
    title: 'Karta KYC',
    attributesTitle: 'Provide your Karta details',
    attributesDescription: 'to process your KYC',
    attributes: authorizedUserAttributes,
    documents: authorizedUserDocuments,
  },
}

const llp = {
  type: 'llp',
  title: 'LLP',
  description: 'If you are an LLP or a Partnership Firm',
  attributesTitle: 'Provide your entity details',
  attributes: [
    {
      type: 'entityName',
      title: 'Entity Name',
      placeholder: 'Name',
      input: 'text',
    },
    {
      type: 'dof',
      title: 'Date of Formation',
      input: 'date',
    },
    {
      type: 'entityPan',
      title: 'PAN',
      placeholder: 'Permanent Account Number (PAN)',
      input: 'text',
    },
  ],
  documents: [
    {
      type: 'partnershipDocument',
      title: 'Registered Partnership Deed',
      description: '',
    },
    {
      type: 'registrationDocument',
      title: 'Registration Certificate',
      description: 'Certificate of Incorporation(COI) — LLP or Registration Certificate — Firm',
    },
    {
      type: 'entityPanDocument',
      title: 'LLP PAN Card',
      description: 'Front side of PAN Card should be legibly visible',
    },
    {
      type: 'resolutionDocument',
      title: 'Resolution Passed Document',
      extraDescription: {
        title: 'Kindly fill the resolution passed sample document — ',
        linkTitle: 'Download sample document',
        link: 'https://drive.google.com/file/d/1sTQOTYDx7K0ITUtmo0BSY4HfLFt-PDDA/view',
      },
    },
  ],
  authorizedUser: {
    type: 'llpUser',
    title: 'Authorized User',
    attributesTitle: 'Provide your authorized user details',
    attributesDescription: 'to process your KYC',
    attributes: authorizedUserAttributes,
    documents: authorizedUserDocuments,
  },
}

const company = {
  type: 'company',
  title: 'Company',
  description: 'If you are a Private or Public Limited Company, an NBFC or a Bank',
  attributesTitle: 'Provide your entity details',
  attributes: [
    {
      type: 'entityName',
      title: 'Entity Name',
      placeholder: 'Name',
      input: 'text',
    },
    {
      type: 'dof',
      title: 'Date of Formation',
      input: 'date',
    },
    {
      type: 'entityPan',
      title: 'PAN',
      placeholder: 'Permanent Account Number (PAN)',
      input: 'text',
    },
  ],
  documents: [
    {
      type: 'registrationDocument',
      title: 'Registration Certificate',
      description: 'Certificate of Incorporation(COI) — LLP or Registration Certificate — Firm',
    },
    {
      type: 'entityPanDocument',
      title: 'Company PAN Card',
      description: 'Front side of PAN Card should be legibly visible',
    },
    {
      type: 'resolutionDocument',
      title: 'Resolution Passed Document',
      extraDescription: {
        title: 'Kindly fill the resolution passed sample document — ',
        linkTitle: 'Download sample document',
        link: 'https://drive.google.com/file/d/1sTQOTYDx7K0ITUtmo0BSY4HfLFt-PDDA/view',
      },
    },
  ],
  authorizedUser: {
    type: 'llpUser',
    title: 'Authorized User',
    attributesTitle: 'Provide your authorized user details',
    attributesDescription: 'to process your KYC',
    attributes: authorizedUserAttributes,
    documents: authorizedUserDocuments,
  },
}

export const registerOptions = [individual, nri, huf, llp, company]

export const gstnKYC = {
  attributesTitle: 'GSTN Details',
  attributesDescription: 'Provide your GSTN proof',
  attributes: [
    {
      type: 'gstn',
      title: 'GST Number (GSTN)',
      placeholder: 'Enter your GSTN',
      input: 'text',
    },
    {
      type: 'address',
      title: 'Address',
      placeholder: 'Enter Full Address',
      input: 'text',
    },
    {
      type: 'location',
      title: 'Location or District',
      placeholder: 'Enter Location or District',
      input: 'text',
    },
    {
      type: 'pincode',
      title: 'PIN Code',
      placeholder: 'PIN Code',
      input: 'text',
    },
  ],
  documents: [{ type: 'gstnDocument', title: 'GSTN Proof', description: 'Provide GSTN Proof' }],
}
