import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Flex,
  Input,
  Layout,
  Popconfirm,
  Space,
  Typography,
  message,
  theme,
} from "antd";

import {
  SearchOutlined,
  SunOutlined,
  MenuFoldOutlined,
  DownOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  CameraOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { queryKeys } from "../../lib/queryKeys";

import {
  logoutUser,
  uploadProfilePicture,
  removeProfilePicture,
} from "../../features/auth/auth.api";

import { authQueryOptions } from "../../features/auth/auth.queries";

import ImageCropDialog from "../common/image-crop-dialog";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function Header({
  collapsed,
  setCollapsed,
  isDark,
  setIsDark,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery(authQueryOptions());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRemovingPicture, setIsRemovingPicture] = useState(false);

  const [cropImage, setCropImage] = useState<string | null>(null);

  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearCropImage = () => {
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }

    setCropImage(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Reset the input so the same file can be selected again.
    event.target.value = "";

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      message.error("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      message.error("Image size must not exceed 5 MB.");
      return;
    }

    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setCropImage(imageUrl);
  };

  const handleCropComplete = async (croppedFile: File) => {
    try {
      setIsUploadingPicture(true);

      await uploadProfilePicture(croppedFile);

      // Refresh the current user's data to get the new Cloudinary URL.
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH_USER],
      });

      message.success("Profile picture updated successfully.");

      clearCropImage();
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Unable to upload profile picture.",
      );

      throw error;
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      setIsRemovingPicture(true);

      await removeProfilePicture();

      // Refresh the current user's data after removal.
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH_USER],
      });

      message.success("Profile picture removed successfully.");
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Unable to remove profile picture.",
      );
    } finally {
      setIsRemovingPicture(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logoutUser();

      await queryClient.cancelQueries({
        queryKey: [queryKeys.AUTH_USER],
      });

      queryClient.setQueryData([queryKeys.AUTH_USER], null);

      message.success("Logged out successfully.");

      navigate("/login", { replace: true });
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Unable to logout. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profileContent = (
    <Card
      styles={{
        body: {
          padding: 16,
        },
      }}
      style={{
        width: 340,
        borderRadius: 14,
      }}
    >
      <Flex vertical align="center" gap={10}>
        <div
          style={{
            position: "relative",
            display: "inline-flex",
          }}
        >
          <Avatar
            size={80}
            src={currentUser?.profilePic || undefined}
            icon={<UserOutlined />}
          />

          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<CameraOutlined />}
            title="Change profile picture"
            onClick={openFilePicker}
            style={{
              position: "absolute",
              right: -4,
              bottom: -4,
              boxShadow: token.boxShadow,
            }}
          />
        </div>

        {currentUser?.profilePic && (
          <Popconfirm
            title="Remove profile picture?"
            description="Your current profile picture will be removed."
            okText="Remove"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: isRemovingPicture,
            }}
            onConfirm={handleRemovePicture}
          >
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              loading={isRemovingPicture}
              disabled={isRemovingPicture}
            >
              Remove picture
            </Button>
          </Popconfirm>
        )}

        <Typography.Title level={5} style={{ margin: 0 }}>
          {currentUser?.userName || "User"}
        </Typography.Title>

        <Typography.Text type="secondary">
          {currentUser?.role || ""}
        </Typography.Text>

        <Typography.Text type="secondary">
          {currentUser?.email || ""}
        </Typography.Text>
      </Flex>

      <Divider />

      <Typography.Text
        type="secondary"
        style={{
          display: "block",
          marginBottom: 10,
        }}
      >
        Account
      </Typography.Text>

      <Flex vertical gap={8}>
        <Button
          type="text"
          block
          icon={<UserOutlined />}
          style={{
            height: 48,
            justifyContent: "flex-start",
          }}
          onClick={() => {
            console.log("My Profile");
          }}
        >
          My Profile
        </Button>

        <Button
          type="text"
          block
          icon={<LockOutlined />}
          style={{
            height: 48,
            justifyContent: "flex-start",
          }}
          onClick={() => {
            console.log("Change Password");
          }}
        >
          Change Password
        </Button>
      </Flex>

      <Divider />

      <Button
        danger
        type="text"
        block
        icon={<LogoutOutlined />}
        loading={isLoggingOut}
        disabled={isLoggingOut}
        style={{
          height: 44,
          justifyContent: "flex-start",
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Card>
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <ImageCropDialog
        open={Boolean(cropImage)}
        image={cropImage}
        onCancel={clearCropImage}
        onCropComplete={handleCropComplete}
        isUploading={isUploadingPicture}
      />

      <Layout.Header
        className="h-20! px-6!"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: token.colorBgContainer,
        }}
      >
        <Flex
          align="center"
          justify="space-between"
          style={{
            height: "100%",
          }}
        >
          <Space size={16}>
            <MenuFoldOutlined
              className="cursor-pointer text-lg"
              onClick={() => setCollapsed(!collapsed)}
            />

            <Input
              prefix={<SearchOutlined />}
              placeholder="Search anything ..."
              className="w-80!"
            />
          </Space>

          <Space size={20}>
            <SunOutlined
              className="cursor-pointer text-lg"
              onClick={() => setIsDark(!isDark)}
            />

            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              popupRender={() => profileContent}
            >
              <Flex align="center" gap={10} className="cursor-pointer">
                <Avatar
                  size={42}
                  src={currentUser?.profilePic || undefined}
                  icon={<UserOutlined />}
                />

                <Flex vertical>
                  <Typography.Text strong>
                    {currentUser?.userName || "User"}
                  </Typography.Text>

                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {currentUser?.role || ""}
                  </Typography.Text>
                </Flex>

                <DownOutlined
                  style={{
                    fontSize: 10,
                    color: token.colorTextSecondary,
                  }}
                />
              </Flex>
            </Dropdown>
          </Space>
        </Flex>
      </Layout.Header>
    </>
  );
}

export default Header;
