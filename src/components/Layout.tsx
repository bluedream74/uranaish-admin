import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const isActive = (path: string): boolean => location.pathname === path;
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-screen">
      <Sidebar className="app" collapsed={collapsed}>
        <Menu>
          <MenuItem 
            className="border-b-2 border-slate-700 bg-slate-200 " 
            icon={
              <MenuRoundedIcon 
                onClick = {() => {
                  setCollapsed(!collapsed);
                }}
              />
            }
          >
            <h2 className="text-[24px]" onClick={() => { navigate('/'); }}>管理メニュー</h2>
          </MenuItem>
          <MenuItem 
            icon={<AccountBalanceRoundedIcon />}
            component={<Link to="/settlement" className="link" />}
            className={isActive('/settlement') ? 'bg-slate-100' : ''}
          > 
            銀行入金処理 
          </MenuItem>
          <MenuItem icon={<ReceiptRoundedIcon />}> ニュース管理 </MenuItem>
          <SubMenu label="バナー表示管理" icon={<BarChartRoundedIcon />}>
            <MenuItem icon={<TimelineRoundedIcon />}> サブアイテム </MenuItem>
            <MenuItem icon={<BubbleChartRoundedIcon />}>サブアイテム</MenuItem>
          </SubMenu>
          {auth.user.email &&
            <MenuItem icon={<LogoutRoundedIcon />} onClick={() => { auth.signout(() => { navigate("/login"); }); }}> Logout </MenuItem>
          }
        </Menu>
      </Sidebar>
      <Outlet />
    </div>
  );
}