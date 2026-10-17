'use client';
import {LogOut,Settings,UserRound} from 'lucide-react';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator} from '@/components/ui/dropdown-menu';
import {DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
export function ProfileMenu({children,name,email,onProfile,onSettings,onLogout}:{children:React.ReactNode;name:string;email:string;onProfile:()=>void;onSettings:()=>void;onLogout:()=>void}){
 return <DropdownMenu><DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger><DropdownMenuContent className="profile-dropdown" align="end" sideOffset={10}><div className="profile-dropdown-heading"><b>{name||'Hesabım'}</b><span>{email}</span></div><DropdownMenuSeparator/><DropdownMenuItem onSelect={()=>requestAnimationFrame(onProfile)}><UserRound size={17}/> Profil bilgileri</DropdownMenuItem><DropdownMenuItem onSelect={onSettings}><Settings size={17}/> Ayarlar</DropdownMenuItem><DropdownMenuSeparator/><DropdownMenuItem onSelect={onLogout}><LogOut size={17}/> Çıkış yap</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}
