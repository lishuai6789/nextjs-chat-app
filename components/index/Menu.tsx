import { Button, Menu, MenuItem } from "@mui/material";
import React, { Suspense, useId, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
const AddFriend = dynamic(() => import('./AddFriend'))
const FormDialog = dynamic(() => import('./FomDialog'))
import { RootState } from "./store";
import { openAddFriend, openProfile } from "./uiSlice";
import AxiosInstance from "../../utils/aixos/axios";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
const Alert = dynamic(() => import('@mui/material/Alert'))
const Snackbar = dynamic(() => import('@mui/material/Snackbar'))

const BasicMenu = memo(function BasicMenu() {
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
  const [error, setError] = useState(false)
  const router = useRouter();
  const logout = () => {
    AxiosInstance.get('/auth/logout')
      .then(async (res: AxiosResponse) => {
        await router.push('/auth/login')
      })
      .catch((err) => {
        setError(true)
      })
  }
  const id = useId();
  return (
    <div style={{ display: 'flex', 'alignItems': 'center' }}>
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
        <MenuItem onClick={(): void => { handleClose(); logout() }}>Logout</MenuItem>
      </Menu>
      {
        toggleProfile && <Suspense>
          <FormDialog />
        </Suspense>
      }
      {
        toggleAddFriend && <Suspense>
          <AddFriend />
        </Suspense>
      }
      {
        error && <Snackbar open={error}
          autoHideDuration={6000}
          onClose={() => setError(false)}>
          <Alert severity="error"
          >
            非常抱歉，网络出现了错误
          </Alert>
        </Snackbar>
      }
    </div>
  );
})

export default BasicMenu