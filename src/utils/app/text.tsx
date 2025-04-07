export const maskMail = (mail: string) => {
  const [localPart, domain] = mail.split("@");
  const maskedLocalPart =
    localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
  return `${maskedLocalPart}@${domain}`;
};

export const dataUrlToFile = (dataUrl: string, filename: string) => {
  const [mime, bstr] = dataUrl.split(",");
  const match = mime.match(/:(.*?);/);
  const type = match ? match[1] : '';
  const byteString = atob(bstr);
  const arrBuffer = new Uint8Array(byteString.length).map((_, i) =>
    byteString.charCodeAt(i)
  );
  return new File([arrBuffer], filename, { type });
};

export const generateRandomString = (length: number = 6) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-1234567890";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};
