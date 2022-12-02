import { Button, Menu, MenuItem } from "@mui/material";
import React, { Suspense, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { RootState } from "../../store/store";
import { openAddFriend, openProfile } from "../../store/uiSlice";
import { useAxios } from "../../api/useAxios";
import { useRouter } from "next/router";
import { reqLogout } from "../../api";
import { message } from "antd";
const AddFriend = dynamic(() => import('./AddFriend'))
const EditProfile = dynamic(() => import('./EditProfile'))

const BasicMenu = function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const toggleProfile: boolean = useSelector((state: RootState) => state.ui.toggleProfile)
  const toggleAddFriend: boolean = useSelector((state: RootState): boolean => state.ui.toggleAddFridend)
  const openAddFriends = () => {
    dispatch(openAddFriend());
  }
  const handleOpenProfile = () => {
    dispatch(openProfile())
  }
  const router = useRouter();
  const AxiosInstance = useAxios();
  const [messageApi, contextHolder] = message.useMessage();
  const logout = async () => {
    const res = await AxiosInstance(reqLogout());
    const data = await res.data;
    if (data.code === 200) {
      messageApi.success({
        content: "成功退出登录"
      });
      router.push("/auth/login");
    } else if (data.code === 500) {
      messageApi.error({
        content: "您还未登录，请先登录"
      });
      router.push("/auth/login");
    }
  }
  const id = useId();
  return (
    <div style={{ display: 'flex', 'alignItems': 'center' }}>
      {contextHolder}
      <Button
        id={id}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
      >
        菜单
      </Button>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={(): void => { handleClose(); openAddFriends() }}>添加好友</MenuItem>
        <MenuItem onClick={(): void => { handleClose(); handleOpenProfile() }}>修改信息</MenuItem>
        <MenuItem onClick={(): void => { handleClose(); logout() }}>退出登录</MenuItem>
      </Menu>
      {
        toggleProfile && <Suspense>
          <EditProfile />
        </Suspense>
      }
      {
        toggleAddFriend && <Suspense>
          <AddFriend />
        </Suspense>
      }
    </div>
  );
}

export default BasicMenu