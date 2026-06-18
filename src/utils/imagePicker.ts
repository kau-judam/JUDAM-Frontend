import * as ImagePicker from 'expo-image-picker';

export type PickedImageFile = {
  uri: string;
  name: string;
  type: string;
};

export type PickImageResult =
  | { canceled: true; denied?: false }
  | { canceled: true; denied: true }
  | { canceled: false; asset: ImagePicker.ImagePickerAsset; file: PickedImageFile };

export type PickMultipleImagesResult =
  | { canceled: true; denied?: false }
  | { canceled: true; denied: true }
  | { canceled: false; assets: ImagePicker.ImagePickerAsset[]; files: PickedImageFile[] };

function getImageExtension(mimeType?: string | null, fileName?: string | null, uri?: string | null) {
  const fromName = (fileName || uri || '').split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName) && fromName.length <= 5) return fromName;
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/heic') return 'heic';
  if (mimeType === 'image/heif') return 'heif';
  return 'jpg';
}

function getImageMimeType(extension: string, fallback?: string | null) {
  if (fallback?.startsWith('image/')) return fallback;
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  if (extension === 'heif') return 'image/heif';
  return 'image/jpeg';
}

export function normalizePickedImageFile(asset: ImagePicker.ImagePickerAsset, fallbackPrefix = 'image'): PickedImageFile {
  const extension = getImageExtension(asset.mimeType, asset.fileName, asset.uri);
  const rawName = asset.fileName || asset.uri.split('?')[0].split('#')[0].split('/').pop();
  const decodedName = rawName ? decodeURIComponent(rawName) : '';
  const safeName = decodedName.replace(/[^\w.-]+/g, '-');
  const name = safeName.includes('.') ? safeName : `${fallbackPrefix}-${Date.now()}.${extension}`;

  return {
    uri: asset.uri,
    name,
    type: getImageMimeType(extension, asset.mimeType),
  };
}

async function requestImageLibraryPermission() {
  const currentPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
  return currentPermission.granted
    ? currentPermission
    : ImagePicker.requestMediaLibraryPermissionsAsync();
}

export async function pickSingleImage(
  fallbackPrefix = 'image',
  quality = 0.9,
  options: Partial<ImagePicker.ImagePickerOptions> = {}
): Promise<PickImageResult> {
  const permission = await requestImageLibraryPermission();

  if (!permission.granted) {
    return { canceled: true, denied: true };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality,
    ...options,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return { canceled: true };
  }

  const asset = result.assets[0];
  return {
    canceled: false,
    asset,
    file: normalizePickedImageFile(asset, fallbackPrefix),
  };
}

export async function pickMultipleImages(
  fallbackPrefix = 'image',
  limit = 5,
  quality = 0.9
): Promise<PickMultipleImagesResult> {
  const permission = await requestImageLibraryPermission();

  if (!permission.granted) {
    return { canceled: true, denied: true };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    selectionLimit: limit,
    quality,
  });

  if (result.canceled || !result.assets?.length) {
    return { canceled: true };
  }

  const assets = result.assets.slice(0, limit).filter((asset) => Boolean(asset.uri));
  return {
    canceled: false,
    assets,
    files: assets.map((asset, index) => normalizePickedImageFile(asset, `${fallbackPrefix}-${index + 1}`)),
  };
}
