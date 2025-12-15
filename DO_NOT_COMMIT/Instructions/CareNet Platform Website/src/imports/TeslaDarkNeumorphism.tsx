import svgPaths from "./svg-1l2b9splvk";
import imgNeonBackground from "figma:asset/e853bf21fbcc1bf500fbd0da029cec4829f1c23a.png";
import imgScreenShot20220203At2251 from "figma:asset/468d4787c20c6b1ad8fb00a73974ece9f7aa247a.png";
import imgImage40 from "figma:asset/6f414a1708eab67cd18926ef903ba3ae4ea6eb67.png";

function Lock() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Lock">
      <div className="absolute flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] left-[22.2px] not-italic text-[20px] text-[rgba(235,235,245,0.3)] text-center text-nowrap top-[22px] tracking-[0.38px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">􀎡</p>
      </div>
    </div>
  );
}

function Climate() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Climate">
      <div className="absolute flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] left-[22.2px] not-italic text-[20px] text-[rgba(235,235,245,0.3)] text-center text-nowrap top-[22px] tracking-[0.38px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">􁁌</p>
      </div>
    </div>
  );
}

function Charge() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Charge">
      <div className="absolute bg-clip-text bg-gradient-to-b flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] from-[#2fb8ff] justify-center leading-[0] left-[21.7px] not-italic text-[20px] text-center text-nowrap to-[#9eecd9] top-[22px] tracking-[0.38px] translate-x-[-50%] translate-y-[-50%]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[24px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Trunk() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Trunk">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Trunk">
          <path d={svgPaths.p6fc5080} fill="var(--fill-0, #EBEBF5)" fillOpacity="0.3" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ControlMenu() {
  return (
    <div className="absolute bg-[#27292d] box-border content-stretch flex items-center justify-between left-[30px] px-[30px] py-[20px] right-[30px] rounded-[50px] shadow-[18px_18px_36px_0px_rgba(0,0,0,0.25),-18px_-18px_36px_0px_rgba(255,255,255,0.25)] top-[380px]" data-name="Control Menu">
      <Lock />
      <Climate />
      <Charge />
      <Trunk />
      <div className="absolute inset-0 pointer-events-none shadow-[1px_1px_2px_0px_inset_rgba(0,0,0,0.02)]" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[108px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.6)] text-center text-nowrap tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">Control</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.3)] text-center text-nowrap tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">􀙙</p>
      </div>
      <Frame2 />
    </div>
  );
}

function Climate1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Climate">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[30px] py-[20px] relative w-full">
          <Frame3 />
          <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.18)] text-center text-nowrap tracking-[0.38px]">
            <p className="leading-[24px] whitespace-pre">􀆊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-center text-nowrap w-[108px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center relative shrink-0 text-[20px] text-[rgba(235,235,245,0.6)] tracking-[0.38px]">
        <p className="leading-[24px] text-nowrap whitespace-pre">Climate</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[17px] text-[rgba(235,235,245,0.3)] tracking-[-0.408px]">
        <p className="leading-[22px] text-nowrap whitespace-pre">Interior 20° C</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[145px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.3)] text-center text-nowrap tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">􁁌</p>
      </div>
      <Frame5 />
    </div>
  );
}

function Control() {
  return (
    <div className="relative shrink-0 w-full" data-name="Control">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[30px] py-[20px] relative w-full">
          <Frame6 />
          <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.18)] text-center text-nowrap tracking-[0.38px]">
            <p className="leading-[24px] whitespace-pre">􀆊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-center text-nowrap w-[108px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center relative shrink-0 text-[20px] text-[rgba(235,235,245,0.6)] tracking-[0.38px]">
        <p className="leading-[24px] text-nowrap whitespace-pre">Location</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[17px] text-[rgba(235,235,245,0.3)] tracking-[-0.408px]">
        <p className="leading-[22px] text-nowrap whitespace-pre">81 rue St-Chales</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[145px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.3)] text-center text-nowrap tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">􀋒</p>
      </div>
      <Frame7 />
    </div>
  );
}

function Control1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Control">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[30px] py-[20px] relative w-full">
          <Frame8 />
          <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.18)] text-center text-nowrap tracking-[0.38px]">
            <p className="leading-[24px] whitespace-pre">􀆊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[108px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.6)] text-center text-nowrap tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">Schedule</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[131px]">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[22.678px] text-[rgba(235,235,245,0.3)] text-center text-nowrap tracking-[0.4309px]">
        <p className="leading-[27.213px] whitespace-pre">􀐭</p>
      </div>
      <Frame9 />
    </div>
  );
}

function Control2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Control">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[30px] py-[20px] relative w-full">
          <Frame10 />
          <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-[rgba(235,235,245,0.18)] text-center text-nowrap tracking-[0.38px]">
            <p className="leading-[24px] whitespace-pre">􀆊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlContent() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.44)] box-border content-stretch flex flex-col items-center justify-center left-[30px] mix-blend-overlay pb-0 pt-[20px] px-0 right-[30px] rounded-[40px] top-[544px]" data-name="Control Content">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[40px]" />
      <Climate1 />
      <Control />
      <Control1 />
      <Control2 />
    </div>
  );
}

function Battery() {
  return (
    <div className="absolute contents left-[calc(83.33%+31px)] top-[17.33px] translate-x-[-50%]" data-name="Battery">
      <div className="absolute h-[11.333px] left-[calc(83.33%+29.83px)] top-[17.33px] translate-x-[-50%] w-[22px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
          <path d={svgPaths.p7e6b880} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
      <div className="absolute h-[4px] left-[calc(83.33%+42.5px)] top-[21px] translate-x-[-50%] w-[1.328px]" data-name="Combined Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
          <path d={svgPaths.p32d253c0} fill="var(--fill-0, white)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.333px] left-[calc(83.33%+29.83px)] top-[19.33px] translate-x-[-50%] w-[18px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
          <path d={svgPaths.p22aabe00} fill="var(--fill-0, white)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute contents left-[calc(83.33%+9.83px)] top-[17.33px] translate-x-[-50%]" data-name="Right Side">
      <Battery />
      <div className="absolute h-[10.966px] left-[calc(83.33%+6.16px)] top-[17.33px] translate-x-[-50%] w-[15.272px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 11">
          <path clipRule="evenodd" d={svgPaths.pbfdb600} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="absolute h-[10.667px] left-[calc(83.33%-15px)] top-[17.67px] translate-x-[-50%] w-[17px]" data-name="Mobile Signal">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 11">
          <path clipRule="evenodd" d={svgPaths.p2836df00} fill="var(--fill-0, white)" fillRule="evenodd" id="Mobile Signal" />
        </svg>
      </div>
    </div>
  );
}

function StatusBarTime() {
  return (
    <div className="absolute h-[21px] left-[calc(16.67%-14.83px)] rounded-[24px] top-[12px] translate-x-[-50%] w-[54px]" data-name="_StatusBar-time">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] h-[20px] justify-center leading-[0] left-[27px] not-italic text-[15px] text-center text-white top-[11px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%] w-[54px]">
        <p className="leading-[20px]">9:41</p>
      </div>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents left-[calc(16.67%-14.83px)] top-[12px] translate-x-[-50%]" data-name="Left Side">
      <StatusBarTime />
    </div>
  );
}

function StatusBarIPhone1313Pro() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip right-px top-0" data-name="StatusBar / iPhone 13 & 13 Pro">
      <RightSide />
      <LeftSide />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Title">
      <div className="flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center relative shrink-0 text-[28px] text-white tracking-[0.36px]">
        <p className="leading-[normal] text-nowrap whitespace-pre">Tesla</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[17px] text-[rgba(235,235,245,0.3)] tracking-[-0.408px]">
        <p className="leading-[22px] text-nowrap whitespace-pre">􀺸 187 km</p>
      </div>
    </div>
  );
}

function ProfilIcon() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[8.5px]" data-name="profil icon">
      <div className="absolute flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] left-[22px] not-italic text-[24px] text-[rgba(235,235,245,0.3)] text-center text-nowrap top-[22px] tracking-[0.36px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">􀉪</p>
      </div>
    </div>
  );
}

function ProfilButton() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Profil Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ProfilIcon />
    </div>
  );
}

function TopNavigation() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 px-[30px] py-0 right-0 top-[64px]" data-name="Top Navigation">
      <Title />
      <ProfilButton />
    </div>
  );
}

function Tesla24X241X() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tesla(24x24)@1x 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tesla(24x24)@1x 1">
          <path d={svgPaths.p36922700} id="Vector" stroke="url(#paint0_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M17 15H7L6 17H18L17 15Z" id="Vector_2" stroke="url(#paint1_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M2 9H4L6 12H18L20 9H22" id="Vector_3" stroke="url(#paint2_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_832" x1="12" x2="12" y1="5" y2="19">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_832" x1="12" x2="12" y1="15" y2="17">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_3_832" x1="12" x2="12" y1="9" y2="12">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center relative shrink-0">
      <Tesla24X241X />
    </div>
  );
}

function ChargeScreen() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Charge Screen">
      <div className="absolute flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] inset-0 justify-center leading-[0] not-italic text-[20px] text-[rgba(235,235,245,0.6)] text-center tracking-[0.38px]">
        <p className="leading-[24px]">􀋦</p>
      </div>
    </div>
  );
}

function Hide() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Hide">
      <div className="absolute left-[-0.5px] size-[44px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Ellipse 803"></g>
        </svg>
      </div>
    </div>
  );
}

function LocationScreen() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Location Screen">
      <div className="absolute bottom-0 flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[-0.5px] not-italic right-[0.5px] text-[22px] text-[rgba(235,235,245,0.6)] text-center top-0 tracking-[0.0324px]">
        <p className="leading-[normal]">􀋒</p>
      </div>
    </div>
  );
}

function ProfilScreen() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Profil Screen">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] inset-0 justify-center leading-[0] not-italic text-[22px] text-[rgba(235,235,245,0.6)] text-center tracking-[0.0324px]">
        <p className="leading-[normal]">􀉪</p>
      </div>
    </div>
  );
}

function TabBarMenu() {
  return (
    <div className="absolute bottom-[17px] content-stretch flex items-center justify-between left-[22px] right-[22px]" data-name="Tab Bar Menu">
      <Frame />
      <ChargeScreen />
      <Hide />
      <LocationScreen />
      <ProfilScreen />
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute bottom-0 h-[78px] left-0 right-0" data-name="Tab bar">
      <div className="absolute bottom-0 h-[78px] left-0 right-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 78">
          <g data-figma-bg-blur-radius="40" filter="url(#filter0_i_3_847)" id="Rectangle 41">
            <path d={svgPaths.pd7fc480} fill="var(--fill-0, white)" fillOpacity="0.44" style={{ mixBlendMode: "overlay" }} />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158" id="filter0_i_3_847" width="470" x="-40" y="-40">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.22 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_847" />
            </filter>
            <clipPath id="bgblur_0_3_847_clip_path" transform="translate(40 40)">
              <path d={svgPaths.pd7fc480} />
            </clipPath>
          </defs>
        </svg>
      </div>
      <TabBarMenu />
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="absolute bottom-[62px] left-1/2 size-[68px] translate-x-[-50%]" data-name="Plus icon">
      <div className="absolute left-1/2 size-[68px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68 68">
          <g data-figma-bg-blur-radius="20" id="Ellipse 808">
            <circle cx="34" cy="34" fill="var(--fill-0, white)" fillOpacity="0.31" r="34" style={{ mixBlendMode: "overlay" }} />
            <circle cx="34" cy="34" r="33.5" stroke="url(#paint0_linear_3_810)" strokeOpacity="0.42" />
          </g>
          <defs>
            <clipPath id="bgblur_0_3_810_clip_path" transform="translate(20 20)">
              <circle cx="34" cy="34" r="34" />
            </clipPath>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_810" x1="34" x2="34" y1="0" y2="68">
              <stop stopColor="white" stopOpacity="0.6" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bg-clip-text bg-gradient-to-b flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] from-[#2fb8ff] justify-center leading-[0] left-[calc(50%-0.5px)] not-italic text-[36px] text-center text-nowrap to-[#9eecd9] top-[calc(50%+0.5px)] tracking-[0.0232px] translate-x-[-50%] translate-y-[-50%]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[normal] whitespace-pre">􀅼</p>
      </div>
    </div>
  );
}

function TabBar1() {
  return (
    <div className="absolute bottom-0 h-[130px] left-0 right-0" data-name="Tab bar">
      <div className="absolute bottom-[15px] left-[16px] size-[40px]" data-name="Neon Light Effect">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <path d={svgPaths.p38d3e400} fill="url(#paint0_linear_3_816)" id="Neon Light Effect" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_816" x1="20" x2="20" y1="0" y2="40">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <TabBar />
      <PlusIcon />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="absolute bottom-0 h-[34px] left-[8px] right-[7px]" data-name="HomeIndicator">
      <div className="absolute bg-white bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Screen() {
  return (
    <div className="bg-gradient-to-b from-[#2a2d32] h-[844px] relative rounded-[40px] shrink-0 to-[#131313] to-[99.171%] w-[390px]" data-name="Screen 1">
      <div className="h-[844px] overflow-clip relative rounded-[inherit] w-[390px]">
        <div className="absolute h-[265px] left-[39px] top-[155px] w-[308px]" data-name="Neon Background">
          <div className="absolute inset-[-75.47%_-64.94%]">
            <img alt="" className="block max-w-none size-full" height="665" src={imgNeonBackground} width="708" />
          </div>
        </div>
        <div className="absolute h-[900px] left-[-19px] top-[-36px] w-[418px]" data-name="Dark - Half Bg">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 418 900">
            <path d="M418 900L16 0L0 900H418Z" fill="url(#paint0_linear_3_1335)" id="Dark - Half Bg" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1335" x1="-3.47254e-06" x2="14" y1="362" y2="804">
                <stop stopColor="#272D31" stopOpacity="0" />
                <stop offset="1" stopColor="#030404" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute h-[198.5px] left-[38px] top-[153px] w-[314.5px]" data-name="Screen_Shot_2022-02-03_at_2.25 1">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgScreenShot20220203At2251} />
        </div>
        <ControlMenu />
        <ControlContent />
        <StatusBarIPhone1313Pro />
        <TopNavigation />
        <TabBar1 />
        <HomeIndicator />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[40px]" />
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="absolute left-[calc(50%+1.25px)] size-[192.5px] top-[223px] translate-x-[-50%]" data-name="Progress Bar">
      <div className="absolute left-[12px] size-[168.204px] top-[12px]">
        <div className="absolute inset-[-49.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 337 337">
            <g filter="url(#filter0_dd_3_1323)" id="Ellipse 821">
              <circle cx="168.109" cy="168.109" fill="url(#paint0_linear_3_1323)" r="84.1022" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="336.218" id="filter0_dd_3_1323" width="336.218" x="-3.8147e-06" y="-3.8147e-06">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-18.6682" dy="-18.6682" />
                <feGaussianBlur stdDeviation="32.6693" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.281875 0 0 0 0 0.314071 0 0 0 0 0.341667 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_1323" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="18.6682" dy="18.6682" />
                <feGaussianBlur stdDeviation="32.6693" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.0767361 0 0 0 0 0.0767361 0 0 0 0 0.0833333 0 0 0 1 0" />
                <feBlend in2="effect1_dropShadow_3_1323" mode="normal" result="effect2_dropShadow_3_1323" />
                <feBlend in="SourceGraphic" in2="effect2_dropShadow_3_1323" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1323" x1="223.54" x2="110.767" y1="233.097" y2="106.944">
                <stop stopColor="#101113" />
                <stop offset="1" stopColor="#2B2F33" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute bg-[#32363b] inset-[19.22%_18.83%_18.83%_19.22%] rounded-[528.517px]">
        <div className="absolute inset-0 pointer-events-none shadow-[2px_1px_2px_0px_inset_rgba(255,255,255,0.05),-26.426px_-26.426px_66.065px_0px_inset_rgba(59,68,81,0.5),26.426px_26.426px_81px_0px_inset_rgba(0,0,0,0.55)]" />
      </div>
      <div className="absolute flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold inset-[41.04%_27.79%_40.78%_28.05%] justify-center leading-[0] text-[#eeeeee] text-[28.707px] text-center">
        <p className="leading-[normal]">30° C</p>
      </div>
      <div className="absolute flex items-center justify-center left-0 size-[192px] top-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="relative size-[192px]" data-name="Ellipse (Stroke)">
            <div className="absolute bottom-[35.85%] left-0 right-1/2 top-[0.23%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96 123">
                <path d={svgPaths.p2c5c400} fill="url(#paint0_linear_3_1331)" id="Ellipse (Stroke)" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1331" x1="96" x2="96" y1="-0.437622" y2="191.562">
                    <stop stopColor="#2FB8FF" />
                    <stop offset="1" stopColor="#9EECD9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListBullet() {
  return (
    <div className="absolute left-[6px] size-[38px] top-[6px]" data-name="List Bullet">
      <div className="absolute bg-clip-text bg-gradient-to-b flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] from-[#2fb8ff] justify-center leading-[0] not-italic right-[18.5px] text-[17px] text-center text-nowrap to-[#9eecd9] top-[19px] tracking-[-0.408px] translate-x-[50%] translate-y-[-50%]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[22px] whitespace-pre">􀇥</p>
      </div>
    </div>
  );
}

function LeftArrowICon() {
  return (
    <div className="relative shrink-0 size-[50px]" data-name="Left Arrow iCon">
      <div className="absolute left-0 size-[50px] top-0">
        <div className="absolute inset-[-28%_-48%_-52%_-32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
            <g filter="url(#filter0_d_3_830)" id="Ellipse 811">
              <circle cx="41" cy="39" fill="url(#paint0_linear_3_830)" r="25" />
              <circle cx="41" cy="39" r="24.5" stroke="var(--stroke-0, #282B2E)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter0_d_3_830" width="90" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4" dy="6" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_830" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_830" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_830" x1="57.25" x2="26" y1="57.75" y2="19.625">
                <stop stopColor="#141515" />
                <stop offset="1" stopColor="#2E3236" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ListBullet />
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[101px]" data-name="Icon">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-center text-white tracking-[-0.408px] w-[41px]">
        <p className="leading-[22px]">Ac</p>
      </div>
      <LeftArrowICon />
    </div>
  );
}

function Line() {
  return (
    <div className="absolute h-[17px] left-[46px] top-[1.5px] w-[27.5px]" data-name="Line">
      <div className="absolute inset-[-108.82%_-89.09%_-155.88%_-70.91%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 62">
          <g filter="url(#filter0_ddi_3_1308)" id="Line">
            <rect fill="url(#paint0_linear_3_1308)" height="17" rx="6" shapeRendering="crispEdges" width="27.5" x="19.5" y="18.5" />
            <rect height="17" rx="6" shapeRendering="crispEdges" stroke="var(--stroke-0, #212325)" width="27.5" x="19.5" y="18.5" />
            <g filter="url(#filter1_ii_3_1308)" id="Rectangle">
              <path d={svgPaths.p5cc2b00} fill="var(--fill-0, #272A2E)" />
            </g>
            <g filter="url(#filter2_ii_3_1308)" id="Rectangle_2">
              <path d={svgPaths.p30039280} fill="var(--fill-0, #272A2E)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="62" id="filter0_ddi_3_1308" width="71.5" x="5.36442e-07" y="5.36442e-07">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="2" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.407843 0 0 0 0 0.827451 0 0 0 0 0.92549 0 0 0 0.15 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_1308" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="4" dy="6" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
              <feBlend in2="effect1_dropShadow_3_1308" mode="normal" result="effect2_dropShadow_3_1308" />
              <feBlend in="SourceGraphic" in2="effect2_dropShadow_3_1308" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.69 0" />
              <feBlend in2="shape" mode="normal" result="effect3_innerShadow_3_1308" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter1_ii_3_1308" width="5.75" x="27.5" y="19.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1308" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0" />
              <feBlend in2="effect1_innerShadow_3_1308" mode="normal" result="effect2_innerShadow_3_1308" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter2_ii_3_1308" width="5.75" x="33.25" y="19.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1308" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0" />
              <feBlend in2="effect1_innerShadow_3_1308" mode="normal" result="effect2_innerShadow_3_1308" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1308" x1="21.4375" x2="43.6968" y1="20.2" y2="41.7858">
              <stop stopColor="#2E3236" />
              <stop offset="1" stopColor="#141515" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Knob() {
  return (
    <div className="absolute contents left-[46px] top-[1.5px]" data-name="Knob">
      <Line />
    </div>
  );
}

function Slider() {
  return (
    <div className="h-[15px] relative shrink-0 w-[192.5px]" data-name="Slider">
      <div className="absolute bg-[#1b1b1d] bottom-[26.67%] left-0 right-0 rounded-[25px] top-[23.33%]" data-name="Track">
        <div className="absolute inset-0 pointer-events-none shadow-[-1.25px_-1.25px_6px_0px_inset_rgba(255,255,255,0.08),1.25px_1.25px_6px_0px_inset_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bottom-[23.33%] left-0 right-[67.03%] top-[26.67%]" data-name="Current">
        <div className="absolute inset-[-50%_-7.88%_-66.67%_-5.91%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73 17">
            <g filter="url(#filter0_d_3_1312)" id="Current">
              <path d={svgPaths.p1c7fc300} fill="url(#paint0_linear_3_1312)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="16.25" id="filter0_d_3_1312" width="72.2188" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="0.625" dy="0.625" />
                <feGaussianBlur stdDeviation="2.1875" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.164167 0 0 0 0 0.820833 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_1312" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_1312" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1312" x1="35.4844" x2="35.4844" y1="3.75" y2="11.25">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <Knob />
    </div>
  );
}

function AcControl() {
  return (
    <div className="content-stretch flex gap-[30px] items-center justify-center relative shrink-0" data-name="Ac Control">
      <Icon />
      <Slider />
    </div>
  );
}

function ListBullet1() {
  return (
    <div className="absolute left-[6px] size-[38px] top-[6px]" data-name="List Bullet">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic right-[19px] text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[19px] tracking-[-0.408px] translate-x-[50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀇤</p>
      </div>
    </div>
  );
}

function LeftArrowICon1() {
  return (
    <div className="relative shrink-0 size-[50px]" data-name="Left Arrow iCon">
      <div className="absolute left-0 size-[50px] top-0">
        <div className="absolute inset-[-28%_-48%_-52%_-32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
            <g filter="url(#filter0_d_3_830)" id="Ellipse 811">
              <circle cx="41" cy="39" fill="url(#paint0_linear_3_830)" r="25" />
              <circle cx="41" cy="39" r="24.5" stroke="var(--stroke-0, #282B2E)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter0_d_3_830" width="90" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4" dy="6" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_830" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_830" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_830" x1="57.25" x2="26" y1="57.75" y2="19.625">
                <stop stopColor="#141515" />
                <stop offset="1" stopColor="#2E3236" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ListBullet1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[101px]" data-name="Icon">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.408px] w-[41px]">
        <p className="leading-[22px]">Fan</p>
      </div>
      <LeftArrowICon1 />
    </div>
  );
}

function Line1() {
  return (
    <div className="absolute h-[15px] left-0 top-[1.5px] w-[27.5px]" data-name="Line">
      <div className="absolute inset-[-96.67%_-89.09%_-176.67%_-60%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 56">
          <g filter="url(#filter0_di_3_1304)" id="Line">
            <rect fill="url(#paint0_linear_3_1304)" height="15" rx="7.5" shapeRendering="crispEdges" width="27.5" x="16.5" y="14.5" />
            <rect height="15" rx="7.5" shapeRendering="crispEdges" stroke="var(--stroke-0, #212325)" width="27.5" x="16.5" y="14.5" />
            <g filter="url(#filter1_ii_3_1304)" id="Rectangle">
              <path d={svgPaths.p3e12b400} fill="var(--fill-0, #272A2E)" />
            </g>
            <g filter="url(#filter2_ii_3_1304)" id="Rectangle_2">
              <path d={svgPaths.p1fd8f80} fill="var(--fill-0, #272A2E)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56" id="filter0_di_3_1304" width="68.5" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="4" dy="6" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_1304" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_1304" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.69 0" />
              <feBlend in2="shape" mode="normal" result="effect2_innerShadow_3_1304" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter1_ii_3_1304" width="5.75" x="24.5" y="14.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1304" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0" />
              <feBlend in2="effect1_innerShadow_3_1304" mode="normal" result="effect2_innerShadow_3_1304" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter2_ii_3_1304" width="5.75" x="30.25" y="14.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1304" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0" />
              <feBlend in2="effect1_innerShadow_3_1304" mode="normal" result="effect2_innerShadow_3_1304" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1304" x1="18.4375" x2="38" y1="16" y2="37.5">
              <stop stopColor="#2E3236" />
              <stop offset="1" stopColor="#141515" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Knob1() {
  return (
    <div className="absolute contents left-0 top-[1.5px]" data-name="Knob">
      <Line1 />
    </div>
  );
}

function Slider1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[192.5px]" data-name="Slider">
      <div className="absolute bg-[#181819] bottom-[26.67%] left-0 right-0 rounded-[25px] top-[23.33%]" data-name="Track">
        <div className="absolute inset-0 pointer-events-none shadow-[-1.25px_-1.25px_6px_0px_inset_rgba(255,255,255,0.08),1.25px_1.25px_6px_0px_inset_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bg-gradient-to-b bottom-[23.33%] from-[#2fb8ff] left-0 right-[91.69%] rounded-[25px] shadow-[0.625px_0.625px_4.375px_0px_#002ad1] to-[#9eecd9] top-[30%]" data-name="Current" />
      <Knob1 />
    </div>
  );
}

function FanControl() {
  return (
    <div className="content-stretch flex gap-[30px] items-center justify-center relative shrink-0" data-name="Fan Control">
      <Icon1 />
      <Slider1 />
    </div>
  );
}

function ListBullet2() {
  return (
    <div className="absolute left-[6px] size-[38px] top-[6px]" data-name="List Bullet">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic right-[18.5px] text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[19px] tracking-[-0.408px] translate-x-[50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􁃛</p>
      </div>
    </div>
  );
}

function LeftArrowICon2() {
  return (
    <div className="relative shrink-0 size-[50px]" data-name="Left Arrow iCon">
      <div className="absolute left-0 size-[50px] top-0">
        <div className="absolute inset-[-28%_-48%_-52%_-32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
            <g filter="url(#filter0_d_3_830)" id="Ellipse 811">
              <circle cx="41" cy="39" fill="url(#paint0_linear_3_830)" r="25" />
              <circle cx="41" cy="39" r="24.5" stroke="var(--stroke-0, #282B2E)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter0_d_3_830" width="90" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4" dy="6" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_830" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_830" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_830" x1="57.25" x2="26" y1="57.75" y2="19.625">
                <stop stopColor="#141515" />
                <stop offset="1" stopColor="#2E3236" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ListBullet2 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[101px]" data-name="Icon">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.408px] w-[41px]">
        <p className="leading-[22px]">Heat</p>
      </div>
      <LeftArrowICon2 />
    </div>
  );
}

function Line2() {
  return (
    <div className="absolute h-[15px] left-0 top-[1.5px] w-[27.5px]" data-name="Line">
      <div className="absolute inset-[-96.67%_-89.09%_-176.67%_-60%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 56">
          <g filter="url(#filter0_di_3_1304)" id="Line">
            <rect fill="url(#paint0_linear_3_1304)" height="15" rx="7.5" shapeRendering="crispEdges" width="27.5" x="16.5" y="14.5" />
            <rect height="15" rx="7.5" shapeRendering="crispEdges" stroke="var(--stroke-0, #212325)" width="27.5" x="16.5" y="14.5" />
            <g filter="url(#filter1_ii_3_1304)" id="Rectangle">
              <path d={svgPaths.p3e12b400} fill="var(--fill-0, #272A2E)" />
            </g>
            <g filter="url(#filter2_ii_3_1304)" id="Rectangle_2">
              <path d={svgPaths.p1fd8f80} fill="var(--fill-0, #272A2E)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56" id="filter0_di_3_1304" width="68.5" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="4" dy="6" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_1304" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_1304" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.69 0" />
              <feBlend in2="shape" mode="normal" result="effect2_innerShadow_3_1304" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter1_ii_3_1304" width="5.75" x="24.5" y="14.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1304" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0" />
              <feBlend in2="effect1_innerShadow_3_1304" mode="normal" result="effect2_innerShadow_3_1304" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter2_ii_3_1304" width="5.75" x="30.25" y="14.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1304" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="-1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0" />
              <feBlend in2="effect1_innerShadow_3_1304" mode="normal" result="effect2_innerShadow_3_1304" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1304" x1="18.4375" x2="38" y1="16" y2="37.5">
              <stop stopColor="#2E3236" />
              <stop offset="1" stopColor="#141515" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Knob2() {
  return (
    <div className="absolute contents left-0 top-[1.5px]" data-name="Knob">
      <Line2 />
    </div>
  );
}

function Slider2() {
  return (
    <div className="h-[15px] relative shrink-0 w-[192.5px]" data-name="Slider">
      <div className="absolute bg-[#151616] bottom-[26.67%] left-0 right-0 rounded-[25px] top-[23.33%]" data-name="Track">
        <div className="absolute inset-0 pointer-events-none shadow-[-1.25px_-1.25px_6px_0px_inset_rgba(255,255,255,0.08),1.25px_1.25px_6px_0px_inset_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bg-gradient-to-b bottom-[23.33%] from-[#2fb8ff] left-0 right-[91.69%] rounded-[25px] shadow-[0.625px_0.625px_4.375px_0px_#002ad1] to-[#9eecd9] top-[30%]" data-name="Current" />
      <Knob2 />
    </div>
  );
}

function HeatControl() {
  return (
    <div className="content-stretch flex gap-[30px] items-center justify-center relative shrink-0" data-name="Heat Control">
      <Icon2 />
      <Slider2 />
    </div>
  );
}

function ListBullet3() {
  return (
    <div className="absolute left-[6px] size-[38px] top-[6px]" data-name="List Bullet">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic right-[18.5px] text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[19px] tracking-[-0.408px] translate-x-[50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀐱</p>
      </div>
    </div>
  );
}

function LeftArrowICon3() {
  return (
    <div className="relative shrink-0 size-[50px]" data-name="Left Arrow iCon">
      <div className="absolute left-0 size-[50px] top-0">
        <div className="absolute inset-[-28%_-48%_-52%_-32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
            <g filter="url(#filter0_d_3_830)" id="Ellipse 811">
              <circle cx="41" cy="39" fill="url(#paint0_linear_3_830)" r="25" />
              <circle cx="41" cy="39" r="24.5" stroke="var(--stroke-0, #282B2E)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter0_d_3_830" width="90" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4" dy="6" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_830" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_830" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_830" x1="57.25" x2="26" y1="57.75" y2="19.625">
                <stop stopColor="#141515" />
                <stop offset="1" stopColor="#2E3236" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ListBullet3 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[101px]" data-name="Icon">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.408px] w-[41px]">
        <p className="leading-[22px]">Auto</p>
      </div>
      <LeftArrowICon3 />
    </div>
  );
}

function Line3() {
  return (
    <div className="absolute h-[15px] left-0 top-[1.5px] w-[27.5px]" data-name="Line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 15">
        <g filter="url(#filter0_i_3_1325)" id="Line">
          <rect fill="var(--fill-0, #363636)" height="15" rx="7.5" width="27.5" />
          <g filter="url(#filter1_ii_3_1325)" id="Rectangle">
            <path d={svgPaths.p1b494480} fill="var(--fill-0, #1F1F1F)" />
          </g>
          <g filter="url(#filter2_ii_3_1325)" id="Rectangle_2">
            <path d={svgPaths.p325da400} fill="var(--fill-0, #1F1F1F)" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="16" id="filter0_i_3_1325" width="28.5" x="-1" y="-1">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="-1" dy="-1" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.69 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1325" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15.5" id="filter1_ii_3_1325" width="6.25" x="7.75" y="-0.25">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="1.25" dy="1.25" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.42 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1325" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="-1.25" dy="-1.25" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.03 0" />
            <feBlend in2="effect1_innerShadow_3_1325" mode="normal" result="effect2_innerShadow_3_1325" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15.5" id="filter2_ii_3_1325" width="6.25" x="13.5" y="-0.25">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="1.25" dy="1.25" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.42 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_1325" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="-1.25" dy="-1.25" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.03 0" />
            <feBlend in2="effect1_innerShadow_3_1325" mode="normal" result="effect2_innerShadow_3_1325" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function Knob3() {
  return (
    <div className="absolute contents left-0 top-[1.5px]" data-name="Knob">
      <Line3 />
    </div>
  );
}

function Slider3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[192.5px]" data-name="Slider">
      <div className="absolute bg-[#1b1b1d] bottom-[26.67%] left-0 right-0 rounded-[25px] top-[23.33%]" data-name="Track">
        <div className="absolute inset-0 pointer-events-none shadow-[-1.25px_-1.25px_6px_0px_inset_rgba(255,255,255,0.08),1.25px_1.25px_6px_0px_inset_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bg-gradient-to-b bottom-[23.33%] from-[#2fb8ff] left-0 right-[91.69%] rounded-[25px] shadow-[0.625px_0.625px_4.375px_0px_#002ad1] to-[#9eecd9] top-[30%]" data-name="Current" />
      <Knob3 />
    </div>
  );
}

function HeatControl1() {
  return (
    <div className="content-stretch flex gap-[30px] items-center justify-center relative shrink-0" data-name="Heat Control">
      <Icon3 />
      <Slider3 />
    </div>
  );
}

function Mode() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[40px] items-start left-[calc(50%-0.25px)] p-[30px] top-[464px] translate-x-[-50%]" data-name="Mode">
      <AcControl />
      <FanControl />
      <HeatControl />
      <HeatControl1 />
    </div>
  );
}

function Power() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Power">
      <div className="absolute bg-clip-text bg-gradient-to-b flex flex-col font-['SF_Pro_Display:Regular',sans-serif] from-[#2fb8ff] justify-center leading-[0] left-[22px] not-italic text-[20px] text-center to-[#9eecd9] top-[22px] tracking-[0.38px] translate-x-[-50%] translate-y-[-50%] w-[24px]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[24px]">􀆨</p>
      </div>
    </div>
  );
}

function LeftArrow() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Left arrow">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[13px] text-center text-white top-[22px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%] w-[10px]">
        <p className="leading-[18px]">􀆉</p>
      </div>
    </div>
  );
}

function RightArrow() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Right arrow">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[13px] text-center text-white top-[22px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%] w-[10px]">
        <p className="leading-[18px]">􀆊</p>
      </div>
    </div>
  );
}

function NumberSetting() {
  return (
    <div className="content-stretch flex gap-[27px] items-center justify-center relative shrink-0 w-[129px]" data-name="number setting">
      <LeftArrow />
      <div className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[34px] text-center text-white tracking-[0.374px] w-[55px]">
        <p className="leading-[41px]">{`20° `}</p>
      </div>
      <RightArrow />
    </div>
  );
}

function Vent() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Vent">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Vent">
          <path d={svgPaths.p2265ba00} fill="var(--fill-0, #EBEBF5)" fillOpacity="0.6" id="Vent icon" />
        </g>
      </svg>
    </div>
  );
}

function Top() {
  return (
    <div className="box-border content-stretch flex gap-[67px] items-center justify-center px-[30px] py-0 relative shrink-0" data-name="Top">
      <Power />
      <NumberSetting />
      <Vent />
    </div>
  );
}

function OnOff() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="On/Off">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[13px] text-center text-white top-[22px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%] w-[24px]">
        <p className="leading-[18px]">On</p>
      </div>
    </div>
  );
}

function Frame4() {
  return <div className="content-stretch flex gap-[27px] h-[41px] items-center justify-center shrink-0 w-[129px]" />;
}

function Vent1() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Vent">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[13px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">Vent</p>
      </div>
    </div>
  );
}

function Bottom() {
  return (
    <div className="box-border content-stretch flex gap-[67px] items-center justify-center px-[30px] py-0 relative shrink-0" data-name="Bottom">
      <OnOff />
      <Frame4 />
      <Vent1 />
    </div>
  );
}

function ModeSetting() {
  return (
    <div className="absolute backdrop-blur-[20px] backdrop-filter bg-[rgba(255,255,255,0.44)] bottom-0 box-border content-stretch flex flex-col gap-[20px] items-center justify-center left-0 mix-blend-overlay px-[50px] py-[20px] right-0 rounded-[40px]" data-name="Mode Setting">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[40px]" />
      <Top />
      <Bottom />
    </div>
  );
}

function LeftArrowIcon() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[9px]" data-name="Left arrow icon">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.408px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀆉</p>
      </div>
    </div>
  );
}

function LeftArrowButton() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Left Arrow Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <LeftArrowIcon />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Title">
      <div className="flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[28px] text-nowrap text-white tracking-[0.36px]">
        <p className="leading-[normal] whitespace-pre">Climate</p>
      </div>
    </div>
  );
}

function Setting() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[9px]" data-name="Setting">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] left-[22px] not-italic text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.408px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀣋</p>
      </div>
    </div>
  );
}

function SettingButton() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Setting Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <Setting />
    </div>
  );
}

function Title2() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 px-[30px] py-0 right-0 top-[64px]" data-name="Title">
      <LeftArrowButton />
      <Title1 />
      <SettingButton />
    </div>
  );
}

function HomeIndicator1() {
  return (
    <div className="absolute bottom-0 h-[34px] left-[8px] right-[7px]" data-name="HomeIndicator">
      <div className="absolute bg-white bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Battery1() {
  return (
    <div className="absolute contents left-[calc(83.33%+31px)] top-[17.33px] translate-x-[-50%]" data-name="Battery">
      <div className="absolute h-[11.333px] left-[calc(83.33%+29.83px)] top-[17.33px] translate-x-[-50%] w-[22px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
          <path d={svgPaths.p7e6b880} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
      <div className="absolute h-[4px] left-[calc(83.33%+42.5px)] top-[21px] translate-x-[-50%] w-[1.328px]" data-name="Combined Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
          <path d={svgPaths.p32d253c0} fill="var(--fill-0, white)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.333px] left-[calc(83.33%+29.83px)] top-[19.33px] translate-x-[-50%] w-[18px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
          <path d={svgPaths.p22aabe00} fill="var(--fill-0, white)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function RightSide1() {
  return (
    <div className="absolute contents left-[calc(83.33%+9.83px)] top-[17.33px] translate-x-[-50%]" data-name="Right Side">
      <Battery1 />
      <div className="absolute h-[10.966px] left-[calc(83.33%+6.16px)] top-[17.33px] translate-x-[-50%] w-[15.272px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 11">
          <path clipRule="evenodd" d={svgPaths.pbfdb600} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="absolute h-[10.667px] left-[calc(83.33%-15px)] top-[17.67px] translate-x-[-50%] w-[17px]" data-name="Mobile Signal">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 11">
          <path clipRule="evenodd" d={svgPaths.p2836df00} fill="var(--fill-0, white)" fillRule="evenodd" id="Mobile Signal" />
        </svg>
      </div>
    </div>
  );
}

function StatusBarTime1() {
  return (
    <div className="absolute h-[21px] left-[calc(16.67%-14.83px)] rounded-[24px] top-[12px] translate-x-[-50%] w-[54px]" data-name="_StatusBar-time">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] h-[20px] justify-center leading-[0] left-[27px] not-italic text-[15px] text-center text-white top-[11px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%] w-[54px]">
        <p className="leading-[20px]">9:41</p>
      </div>
    </div>
  );
}

function LeftSide1() {
  return (
    <div className="absolute contents left-[calc(16.67%-14.83px)] top-[12px] translate-x-[-50%]" data-name="Left Side">
      <StatusBarTime1 />
    </div>
  );
}

function StatusBarIPhone1313Pro1() {
  return (
    <div className="absolute h-[44px] left-[0.5px] overflow-clip right-[0.5px] top-0" data-name="StatusBar / iPhone 13 & 13 Pro">
      <RightSide1 />
      <LeftSide1 />
    </div>
  );
}

function Screen1() {
  return (
    <div className="bg-gradient-to-b from-[#2a2d32] h-[844px] relative rounded-[40px] shrink-0 to-[#131313] to-[99.171%] w-[390px]" data-name="Screen 2">
      <div className="h-[844px] overflow-clip relative rounded-[inherit] w-[390px]">
        <div className="absolute h-[314px] left-[187px] top-[699px] w-[308px]" data-name="Neon Background">
          <div className="absolute inset-[-63.69%_-64.94%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 708 714">
              <g filter="url(#filter0_f_3_1329)" id="Neon Background">
                <ellipse cx="354" cy="357" fill="var(--fill-0, #56CCF2)" fillOpacity="0.2" rx="154" ry="157" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="714" id="filter0_f_3_1329" width="708" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur_3_1329" stdDeviation="100" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <ProgressBar />
        <Mode />
        <ModeSetting />
        <Title2 />
        <HomeIndicator1 />
        <StatusBarIPhone1313Pro1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[40px]" />
    </div>
  );
}

function ListBullet4() {
  return (
    <div className="absolute left-[6px] size-[38px] top-[6px]" data-name="List Bullet">
      <div className="absolute flex items-center justify-center right-[18.5px] top-[19px] translate-x-[50%] translate-y-[-50%]">
        <div className="flex-none rotate-[180deg]">
          <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative text-[20px] text-[rgba(235,235,245,0.6)] text-center text-nowrap tracking-[0.38px]">
            <p className="leading-[24px] whitespace-pre">􀆇</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftArrowICon4() {
  return (
    <div className="relative shrink-0 size-[50px]" data-name="Left Arrow iCon">
      <div className="absolute left-0 size-[50px] top-0">
        <div className="absolute inset-[-28%_-48%_-52%_-32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
            <g filter="url(#filter0_d_3_830)" id="Ellipse 811">
              <circle cx="41" cy="39" fill="url(#paint0_linear_3_830)" r="25" />
              <circle cx="41" cy="39" r="24.5" stroke="var(--stroke-0, #282B2E)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter0_d_3_830" width="90" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4" dy="6" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_830" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_830" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_830" x1="57.25" x2="26" y1="57.75" y2="19.625">
                <stop stopColor="#141515" />
                <stop offset="1" stopColor="#2E3236" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ListBullet4 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative shrink-0 w-full">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">Nearby Superchargers</p>
      </div>
      <LeftArrowICon4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Montreal, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">4 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame12 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 3">
      <Frame11 />
      <Frame13 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame15 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 2">
      <Frame14 />
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame18 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 4">
      <Frame17 />
      <Frame19 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame21 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 5">
      <Frame20 />
      <Frame22 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame24 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 6">
      <Frame23 />
      <Frame25 />
    </div>
  );
}

function ModeDescription() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-center justify-center left-1/2 px-[30px] py-[20px] rounded-[40px] top-[4px] translate-x-[-50%] w-[338px]" data-name="Mode Description">
      <Frame26 />
      <Row1 />
      <Row />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}

function DropdownTableRow() {
  return (
    <div className="absolute bg-[#202122] h-[314px] left-1/2 overflow-x-clip overflow-y-auto rounded-[40px] top-[500px] translate-x-[-50%] w-[330px]" data-name="Dropdown Table Row">
      <ModeDescription />
      <div className="absolute inset-0 pointer-events-none shadow-[-6px_-6px_12px_0px_inset_rgba(255,255,255,0.25),6px_6px_12px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Tesla24X241X1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tesla(24x24)@1x 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tesla(24x24)@1x 1">
          <path d={svgPaths.p36922700} id="Vector" stroke="url(#paint0_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M17 15H7L6 17H18L17 15Z" id="Vector_2" stroke="url(#paint1_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M2 9H4L6 12H18L20 9H22" id="Vector_3" stroke="url(#paint2_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_832" x1="12" x2="12" y1="5" y2="19">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_832" x1="12" x2="12" y1="15" y2="17">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_3_832" x1="12" x2="12" y1="9" y2="12">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center relative shrink-0">
      <Tesla24X241X1 />
    </div>
  );
}

function ChargeScreen1() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Charge Screen">
      <div className="absolute flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] inset-0 justify-center leading-[0] not-italic text-[20px] text-[rgba(235,235,245,0.6)] text-center tracking-[0.38px]">
        <p className="leading-[24px]">􀋦</p>
      </div>
    </div>
  );
}

function Hide1() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Hide">
      <div className="absolute left-[-0.5px] size-[44px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Ellipse 803"></g>
        </svg>
      </div>
    </div>
  );
}

function LocationScreen1() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Location Screen">
      <div className="absolute bottom-0 flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[-0.5px] not-italic right-[0.5px] text-[22px] text-[rgba(235,235,245,0.6)] text-center top-0 tracking-[0.0324px]">
        <p className="leading-[normal]">􀋒</p>
      </div>
    </div>
  );
}

function ProfilScreen1() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Profil Screen">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] inset-0 justify-center leading-[0] not-italic text-[22px] text-[rgba(235,235,245,0.6)] text-center tracking-[0.0324px]">
        <p className="leading-[normal]">􀉪</p>
      </div>
    </div>
  );
}

function TabBarMenu1() {
  return (
    <div className="absolute bottom-[17px] content-stretch flex items-center justify-between left-[22px] right-[22px]" data-name="Tab Bar Menu">
      <Frame1 />
      <ChargeScreen1 />
      <Hide1 />
      <LocationScreen1 />
      <ProfilScreen1 />
    </div>
  );
}

function TabBar2() {
  return (
    <div className="absolute bottom-0 h-[78px] left-0 right-0" data-name="Tab bar">
      <div className="absolute bottom-0 h-[78px] left-0 right-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 78">
          <g data-figma-bg-blur-radius="40" filter="url(#filter0_i_3_847)" id="Rectangle 41">
            <path d={svgPaths.pd7fc480} fill="var(--fill-0, white)" fillOpacity="0.44" style={{ mixBlendMode: "overlay" }} />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158" id="filter0_i_3_847" width="470" x="-40" y="-40">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.22 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_847" />
            </filter>
            <clipPath id="bgblur_0_3_847_clip_path" transform="translate(40 40)">
              <path d={svgPaths.pd7fc480} />
            </clipPath>
          </defs>
        </svg>
      </div>
      <TabBarMenu1 />
    </div>
  );
}

function PlusIcon1() {
  return (
    <div className="absolute bottom-[62px] left-1/2 size-[68px] translate-x-[-50%]" data-name="Plus icon">
      <div className="absolute left-1/2 size-[68px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68 68">
          <g data-figma-bg-blur-radius="20" id="Ellipse 808">
            <circle cx="34" cy="34" fill="var(--fill-0, white)" fillOpacity="0.31" r="34" style={{ mixBlendMode: "overlay" }} />
            <circle cx="34" cy="34" r="33.5" stroke="url(#paint0_linear_3_810)" strokeOpacity="0.42" />
          </g>
          <defs>
            <clipPath id="bgblur_0_3_810_clip_path" transform="translate(20 20)">
              <circle cx="34" cy="34" r="34" />
            </clipPath>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_810" x1="34" x2="34" y1="0" y2="68">
              <stop stopColor="white" stopOpacity="0.6" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bg-clip-text bg-gradient-to-b flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] from-[#2fb8ff] justify-center leading-[0] left-[calc(50%-0.5px)] not-italic text-[36px] text-center text-nowrap to-[#9eecd9] top-[calc(50%+0.5px)] tracking-[0.0232px] translate-x-[-50%] translate-y-[-50%]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[normal] whitespace-pre">􀅼</p>
      </div>
    </div>
  );
}

function TabBar3() {
  return (
    <div className="absolute bottom-0 h-[130px] left-0 right-0" data-name="Tab bar">
      <div className="absolute bottom-[15px] left-[91px] size-[40px]" data-name="Neon Light Effect">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <path d={svgPaths.p38d3e400} fill="url(#paint0_linear_3_816)" id="Neon Light Effect" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_816" x1="20" x2="20" y1="0" y2="40">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <TabBar2 />
      <PlusIcon1 />
    </div>
  );
}

function BatteryBase() {
  return (
    <div className="absolute h-[39px] left-0 top-[73px] w-[274px]" data-name="Battery Base">
      <div className="absolute inset-[-1.28%_-2.19%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 286 40">
          <g id="Battery Base">
            <g data-figma-bg-blur-radius="20" filter="url(#filter0_i_3_839)" id="Vector 14">
              <path d={svgPaths.p29947180} fill="var(--fill-0, white)" fillOpacity="0.2" style={{ mixBlendMode: "overlay" }} />
              <path d={svgPaths.p29947180} stroke="url(#paint0_linear_3_839)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <g filter="url(#filter1_f_3_839)" id="Rectangle 36">
              <path d="M6 23.5H280V28.5H6V23.5Z" fill="var(--fill-0, black)" fillOpacity="0.17" style={{ mixBlendMode: "overlay" }} />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="80" id="filter0_i_3_839" width="313.988" x="-13.488" y="-20">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="11" dy="5" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.29 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_839" />
            </filter>
            <clipPath id="bgblur_0_3_839_clip_path" transform="translate(13.488 20)">
              <path d={svgPaths.p29947180} />
            </clipPath>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="17" id="filter1_f_3_839" width="286" x="0" y="17.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_3_839" stdDeviation="3" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_839" x1="143.5" x2="143.5" y1="0.5" y2="39.5">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function BatteryCharge() {
  return (
    <div className="absolute h-[39px] left-[0.5px] top-[73px] w-[153.5px]" data-name="Battery Charge">
      <div className="absolute inset-[-20.51%_-5.21%_-20.51%_-4.89%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 55">
          <g id="Battery Charge">
            <g filter="url(#filter0_i_3_822)" id="Vector 15">
              <path d={svgPaths.pc284500} fill="url(#paint0_linear_3_822)" />
            </g>
            <g filter="url(#filter1_if_3_822)" id="Vector 19">
              <path d={svgPaths.pc284500} fill="url(#paint1_linear_3_822)" />
            </g>
            <mask height="39" id="mask0_3_822" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="154" x="7" y="8">
              <path d={svgPaths.p3ce3c600} fill="url(#paint2_linear_3_822)" id="Vector 18" />
            </mask>
            <g mask="url(#mask0_3_822)">
              <g filter="url(#filter2_f_3_822)" id="Rectangle 35">
                <rect fill="var(--fill-0, black)" fillOpacity="0.04" height="5" style={{ mixBlendMode: "overlay" }} width="292" y="31" />
              </g>
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44" id="filter0_i_3_822" width="153" x="8" y="8">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_822" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="55" id="filter1_if_3_822" width="169" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_822" />
              <feGaussianBlur result="effect2_foregroundBlur_3_822" stdDeviation="4" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13" id="filter2_f_3_822" width="300" x="-4" y="27">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_3_822" stdDeviation="2" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_822" x1="84.5" x2="84.5" y1="8" y2="47">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_822" x1="84.5" x2="84.5" y1="8" y2="47">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_3_822" x1="144.5" x2="144.5" y1="8" y2="47">
              <stop stopColor="#76AA6E" />
              <stop offset="0.346154" stopColor="#204A25" />
              <stop offset="0.628205" stopColor="#1E4B20" />
              <stop offset="1" stopColor="#3B8527" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function NeonEffect() {
  return (
    <div className="absolute h-[97px] left-px top-0 w-[153px]" data-name="Neon Effect">
      <div className="absolute bottom-0 left-[-3.92%] right-[-3.27%] top-[-14.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 164 111">
          <g id="Neon Effect">
            <path d={svgPaths.p33f12b00} fill="url(#paint0_linear_3_818)" fillOpacity="0.2" id="Rectangle 43" />
            <g filter="url(#filter0_f_3_818)" id="Rectangle 45">
              <path d="M14 14H150V33V87H14V35V14Z" fill="url(#paint1_linear_3_818)" fillOpacity="0.3" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="101" id="filter0_f_3_818" width="164" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_3_818" stdDeviation="7" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_818" x1="83.9807" x2="83" y1="9.91579" y2="127">
              <stop offset="0.195856" stopColor="#2FB8FF" stopOpacity="0" />
              <stop offset="0.546579" stopColor="#4BC6F5" stopOpacity="0.4" />
              <stop offset="0.83609" stopColor="#6BD4EB" stopOpacity="0.7" />
              <stop offset="1" stopColor="#85E0E1" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_818" x1="70.0548" x2="69.9301" y1="18.4401" y2="103.487">
              <stop stopColor="#EBEEFE" stopOpacity="0" />
              <stop offset="0.409309" stopColor="#8DE1EB" stopOpacity="0.5" />
              <stop offset="0.674333" stopColor="#8FB6E6" stopOpacity="0.7" />
              <stop offset="0.895165" stopColor="#5DAAB3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Battery2() {
  return (
    <div className="h-[112px] relative shrink-0 w-[274px]" data-name="Battery">
      <BatteryBase />
      <BatteryCharge />
      <NeonEffect />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0" data-name="50%">
      <div className="h-[9px] relative shrink-0 w-0">
        <div className="absolute bottom-0 left-[-1px] right-[-1px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 9">
            <path d="M1 0V9" id="Vector 21" stroke="url(#paint0_linear_3_814)" strokeWidth="2" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_814" x1="1.5" x2="1.5" y1="0" y2="9">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-nowrap text-white tracking-[-0.078px]">
        <p className="leading-[18px] whitespace-pre">75%</p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0" data-name="100%">
      <div className="h-[9px] relative shrink-0 w-0">
        <div className="absolute bottom-0 left-[-1px] right-[-1px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 9">
            <path d="M1 0V9" id="Vector 21" opacity="0.6" stroke="url(#paint0_linear_3_808)" strokeWidth="2" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_808" x1="1.5" x2="1.5" y1="0" y2="9">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-nowrap tracking-[-0.078px]">
        <p className="leading-[18px] whitespace-pre">100%</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[35px] items-start justify-end relative shrink-0 w-[273px]" data-name="%">
      <Component1 />
      <Component2 />
    </div>
  );
}

function Slider4() {
  return (
    <div className="h-[18px] relative shrink-0 w-[273px]" data-name="Slider">
      <div className="absolute bg-[rgba(36,37,40,0.7)] h-[9px] left-0 rounded-[25px] top-[6px] w-[273px]">
        <div className="absolute inset-0 pointer-events-none shadow-[-2px_-2px_4px_0px_inset_rgba(255,255,255,0.08),2px_2px_4px_0px_inset_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute h-[18px] left-[191px] top-0 w-[24px]">
        <div className="absolute inset-[-29.95%_-29.55%_-105.56%_-64.32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 43">
            <g filter="url(#filter0_d_3_806)" id="Vector 12">
              <path d={svgPaths.p2732a080} fill="url(#paint0_linear_3_806)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42.3918" id="filter0_d_3_806" width="46.5291" x="2.38419e-07" y="-2.38419e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-4" dy="6" />
                <feGaussianBlur stdDeviation="6.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="overlay" result="effect1_dropShadow_3_806" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_806" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_806" x1="27.437" x2="27.437" y1="5.39181" y2="23.3918">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Battery3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[199px] items-center justify-between left-1/2 px-[28px] py-0 top-[264px] translate-x-[-50%]" data-name="Battery">
      <Battery2 />
      <Component />
      <Slider4 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-nowrap tracking-[-0.078px]">
        <p className="leading-[18px] whitespace-pre">Set Charge Limit</p>
      </div>
    </div>
  );
}

function LeftArrowIcon1() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[9px]" data-name="Left arrow icon">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.408px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀆉</p>
      </div>
    </div>
  );
}

function LeftArrowButton1() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Left Arrow Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <LeftArrowIcon1 />
    </div>
  );
}

function Title3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Title">
      <div className="flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[28px] text-nowrap text-white tracking-[0.36px]">
        <p className="leading-[normal] whitespace-pre">Charging</p>
      </div>
    </div>
  );
}

function Setting1() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[9px]" data-name="Setting">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] left-[22px] not-italic text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.408px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀣋</p>
      </div>
    </div>
  );
}

function SettingButton1() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Setting Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <Setting1 />
    </div>
  );
}

function Title4() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 px-[30px] py-0 right-0 top-[64px]" data-name="Title">
      <LeftArrowButton1 />
      <Title3 />
      <SettingButton1 />
    </div>
  );
}

function Battery4() {
  return (
    <div className="absolute contents left-[calc(83.33%+31px)] top-[17.33px] translate-x-[-50%]" data-name="Battery">
      <div className="absolute h-[11.333px] left-[calc(83.33%+29.83px)] top-[17.33px] translate-x-[-50%] w-[22px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
          <path d={svgPaths.p7e6b880} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
      <div className="absolute h-[4px] left-[calc(83.33%+42.5px)] top-[21px] translate-x-[-50%] w-[1.328px]" data-name="Combined Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
          <path d={svgPaths.p32d253c0} fill="var(--fill-0, white)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.333px] left-[calc(83.33%+29.83px)] top-[19.33px] translate-x-[-50%] w-[18px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
          <path d={svgPaths.p22aabe00} fill="var(--fill-0, white)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function RightSide2() {
  return (
    <div className="absolute contents left-[calc(83.33%+9.83px)] top-[17.33px] translate-x-[-50%]" data-name="Right Side">
      <Battery4 />
      <div className="absolute h-[10.966px] left-[calc(83.33%+6.16px)] top-[17.33px] translate-x-[-50%] w-[15.272px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 11">
          <path clipRule="evenodd" d={svgPaths.pbfdb600} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="absolute h-[10.667px] left-[calc(83.33%-15px)] top-[17.67px] translate-x-[-50%] w-[17px]" data-name="Mobile Signal">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 11">
          <path clipRule="evenodd" d={svgPaths.p2836df00} fill="var(--fill-0, white)" fillRule="evenodd" id="Mobile Signal" />
        </svg>
      </div>
    </div>
  );
}

function StatusBarTime2() {
  return (
    <div className="absolute h-[21px] left-[calc(16.67%-14.83px)] rounded-[24px] top-[12px] translate-x-[-50%] w-[54px]" data-name="_StatusBar-time">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] h-[20px] justify-center leading-[0] left-[27px] not-italic text-[15px] text-center text-white top-[11px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%] w-[54px]">
        <p className="leading-[20px]">9:41</p>
      </div>
    </div>
  );
}

function LeftSide2() {
  return (
    <div className="absolute contents left-[calc(16.67%-14.83px)] top-[12px] translate-x-[-50%]" data-name="Left Side">
      <StatusBarTime2 />
    </div>
  );
}

function StatusBarIPhone1313Pro2() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip right-px top-0" data-name="StatusBar / iPhone 13 & 13 Pro">
      <RightSide2 />
      <LeftSide2 />
    </div>
  );
}

function HomeIndicator2() {
  return (
    <div className="absolute bottom-0 h-[34px] left-[8px] right-[7px]" data-name="HomeIndicator">
      <div className="absolute bg-white bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Screen2() {
  return (
    <div className="bg-gradient-to-b from-[#2a2d32] h-[844px] relative rounded-[40px] shrink-0 to-[#1d1d1d] to-[99.171%] w-[390px]" data-name="Screen 3">
      <div className="h-[844px] overflow-clip relative rounded-[inherit] w-[390px]">
        <div className="absolute h-[314px] left-[calc(50%-159px)] top-[190px] translate-x-[-50%] w-[308px]" data-name="Neon Background">
          <div className="absolute inset-[-63.69%_-64.94%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 708 714">
              <g filter="url(#filter0_f_3_843)" id="Neon Background">
                <ellipse cx="354" cy="357" fill="var(--fill-0, #56CCF2)" fillOpacity="0.1" rx="154" ry="157" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="714" id="filter0_f_3_843" width="708" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur_3_843" stdDeviation="100" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <DropdownTableRow />
        <TabBar3 />
        <Battery3 />
        <div className="absolute flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] left-[195px] not-italic text-[0px] text-center text-nowrap text-white top-[307.5px] tracking-[0.374px] translate-x-[-50%] translate-y-[-50%]">
          <p className="whitespace-pre">
            <span className="font-['SF_Pro_Display:Bold',sans-serif] leading-[41px] text-[34px] text-white tracking-[0.374px]">65</span>
            <span className="font-['SF_Pro_Display:Semibold',sans-serif] leading-[24px] text-[20px] text-[rgba(235,235,245,0.6)] tracking-[0.38px]">%</span>
          </p>
        </div>
        <div className="absolute h-[221.119px] left-[calc(50%+0.15px)] top-[116px] translate-x-[-50%] w-[382.303px]" data-name="image 40">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage40} />
        </div>
        <Title4 />
        <StatusBarIPhone1313Pro2 />
        <HomeIndicator2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[40px]" />
    </div>
  );
}

export default function TeslaDarkNeumorphism() {
  return (
    <div className="relative rounded-[60px] size-full" data-name="Tesla Dark Neumorphism">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[65px] items-start p-[150px] relative size-full">
          <Screen />
          <Screen1 />
          <Screen2 />
        </div>
      </div>
    </div>
  );
}