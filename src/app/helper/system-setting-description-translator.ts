export const systemSettingDescriptions: Record<string, string> = {
  'receipt.store_data.description': $localize`:@@systemSettings.receipt.storeData:The text which appears on the receipt, and contains the description from the store.`,
  'receipt.store_contact.description': $localize`:@@systemSettings.receipt.storeContact:The contact information of the store, which appears on the receipt.`,
  'receipt.note.description': $localize`:@@systemSettings.receipt.note:Additional note that appears on the receipt.`,
  'receipt.title.description': $localize`:@@systemSettings.receipt.title:The title that appears on the receipt.`,
};

export const translateSystemSettingDescription = (key: string): string => {
  return systemSettingDescriptions[key] || key;
};
