
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

import {
  Button,
  Modal,
  Slider,
  Space,
  Typography,
  message,
} from "antd";

import type { Area } from "react-easy-crop";

interface ImageCropDialogProps {
  open: boolean;
  image: string | null;
  onCancel: () => void;
  onCropComplete: (file: File) => Promise<void> | void;
  isUploading?: boolean;
}

const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob> => {
  const image = new Image();

  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error("Unable to load the selected image."));
  });

  const canvas = document.createElement("canvas");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process the image.");
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to generate cropped image."));
        }
      },
      "image/jpeg",
      0.9,
    );
  });
};

function ImageCropDialog({
  open,
  image,
  onCancel,
  onCropComplete,
  isUploading = false,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleConfirm = async () => {
    if (!image || !croppedAreaPixels) {
      message.error("Please select an image to crop.");
      return;
    }

    try {
      setIsProcessing(true);

      const croppedBlob = await createCroppedImage(
        image,
        croppedAreaPixels,
      );

      const croppedFile = new File(
        [croppedBlob],
        "profile-picture.jpg",
        {
          type: "image/jpeg",
        },
      );

      await onCropComplete(croppedFile);
    } catch (error) {
      // The parent handles upload errors.
      // This catch handles cropping errors.
      if (!(error instanceof Error)) {
        message.error("Unable to crop the image.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isBusy = isProcessing || isUploading;

  return (
    <Modal
      title="Adjust Profile Picture"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnHidden
      closable={!isBusy}
      maskClosable={!isBusy}
      keyboard={!isBusy}
      width={480}
    >
      {image && (
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%" }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 320,
              background: "#333",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>

          <div>
            <Typography.Text strong>
              Zoom
            </Typography.Text>

            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={setZoom}
              disabled={isBusy}
            />
          </div>

          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={onCancel}
              disabled={isBusy}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={isBusy}
              disabled={isBusy}
              onClick={handleConfirm}
            >
              Crop Image
            </Button>
          </Space>
        </Space>
      )}
    </Modal>
  );
}

export default ImageCropDialog;
