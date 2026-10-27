import {
  Anchor,
  Atom,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Camera,
  Car,
  Cloud,
  Code2,
  Coins,
  Compass,
  CreditCard,
  Crosshair,
  Cpu,
  Database,
  Factory,
  FileText,
  Film,
  Flame,
  Folder,
  Gamepad2,
  Globe,
  GraduationCap,
  HardHat,
  Heart,
  Landmark,
  Leaf,
  Mail,
  Megaphone,
  Music,
  Newspaper,
  Package,
  Palette,
  Plane,
  Radio,
  Scale,
  Search,
  Server,
  Share2,
  Shield,
  ShieldAlert,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Sprout,
  Stethoscope,
  SunMedium,
  Truck,
  Tv,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

type CategoryIconProps = {
  category?: string;
  slug?: string;
  className?: string;
};

export function CategoryIcon({ category, slug, className = "w-4 h-4" }: CategoryIconProps) {
  const norm = (category || slug || "").toLowerCase();

  if (norm.includes("all") || norm === "") {
    return <Compass className={className} aria-hidden="true" />;
  }
  // Automotive, Cars, Trucks, Tractors
  if (norm.includes("tractor") || norm.includes("farm machinery") || norm.includes("agriculture")) {
    return <Sprout className={className} aria-hidden="true" />;
  }
  if (norm.includes("truck") || norm.includes("freight") || norm.includes("hauler")) {
    return <Truck className={className} aria-hidden="true" />;
  }
  if (norm.includes("car") || norm.includes("automobile") || norm.includes("automotive") || norm.includes("vehicle")) {
    return <Car className={className} aria-hidden="true" />;
  }
  // Cameras & Photography
  if (norm.includes("camera") || norm.includes("photo") || norm.includes("lens") || norm.includes("optics") || norm.includes("photography")) {
    return <Camera className={className} aria-hidden="true" />;
  }
  // OTT / Video / Streaming / Film
  if (norm.includes("ott") || norm.includes("streaming") || norm.includes("stream") || norm.includes("tv")) {
    return <Tv className={className} aria-hidden="true" />;
  }
  if (norm.includes("film") || norm.includes("video") || norm.includes("movie") || norm.includes("cinema")) {
    return <Film className={className} aria-hidden="true" />;
  }
  if (norm.includes("music") || norm.includes("audio") || norm.includes("sound") || norm.includes("podcast")) {
    return <Music className={className} aria-hidden="true" />;
  }
  // Social & Creators
  if (norm.includes("social") || norm.includes("creator") || norm.includes("instagram") || norm.includes("twitter") || norm.includes("tiktok") || norm.includes("community")) {
    return <Share2 className={className} aria-hidden="true" />;
  }
  // Dev & Code
  if (norm.includes("coding") || norm.includes("developer") || norm.includes("code") || norm.includes("dev") || norm.includes("programming") || norm.includes("sdk") || norm.includes("api")) {
    return <Code2 className={className} aria-hidden="true" />;
  }
  // Cloud & Databases
  if (norm.includes("database") || norm.includes("sql") || norm.includes("storage") || norm.includes("data science") || norm.includes("data engineering")) {
    return <Database className={className} aria-hidden="true" />;
  }
  if (norm.includes("cloud") || norm.includes("hosting") || norm.includes("server") || norm.includes("devops") || norm.includes("kubernetes")) {
    return <Cloud className={className} aria-hidden="true" />;
  }
  // AI & Robotics
  if (norm.includes("ai") || norm.includes("agent") || norm.includes("intelligence") || norm.includes("robot") || norm.includes("autonomous") || norm.includes("machine learning")) {
    return <Bot className={className} aria-hidden="true" />;
  }
  // Gaming & Esports
  if (norm.includes("game") || norm.includes("gaming") || norm.includes("esport")) {
    return <Gamepad2 className={className} aria-hidden="true" />;
  }
  // Fintech & Crypto
  if (norm.includes("crypto") || norm.includes("web3") || norm.includes("blockchain") || norm.includes("defi") || norm.includes("nft")) {
    return <Coins className={className} aria-hidden="true" />;
  }
  if (norm.includes("fintech") || norm.includes("banking") || norm.includes("finance") || norm.includes("payment") || norm.includes("money") || norm.includes("remittance") || norm.includes("tax")) {
    return <CreditCard className={className} aria-hidden="true" />;
  }
  // Government & Public Admin
  if (norm.includes("government") || norm.includes("civic") || norm.includes("public admin") || norm.includes("municipal") || norm.includes("parliament") || norm.includes("election")) {
    return <Landmark className={className} aria-hidden="true" />;
  }
  // Law & Legal
  if (norm.includes("law") || norm.includes("legal") || norm.includes("contract") || norm.includes("court") || norm.includes("judiciary") || norm.includes("compliance") || norm.includes("patent")) {
    return <Scale className={className} aria-hidden="true" />;
  }
  // Police & Safety & Security
  if (norm.includes("police") || norm.includes("emergency") || norm.includes("disaster") || norm.includes("crime") || norm.includes("fire & rescue") || norm.includes("alert")) {
    return <ShieldAlert className={className} aria-hidden="true" />;
  }
  if (norm.includes("military") || norm.includes("defense") || norm.includes("army") || norm.includes("naval") || norm.includes("crosshair") || norm.includes("armed forces")) {
    return <Crosshair className={className} aria-hidden="true" />;
  }
  if (norm.includes("security") || norm.includes("cyber") || norm.includes("privacy") || norm.includes("zero-trust") || norm.includes("authentication")) {
    return <Shield className={className} aria-hidden="true" />;
  }
  // Healthcare & Medicine
  if (norm.includes("health") || norm.includes("doctor") || norm.includes("hospital") || norm.includes("medicine") || norm.includes("telemedicine") || norm.includes("clinical") || norm.includes("pharma")) {
    return <Stethoscope className={className} aria-hidden="true" />;
  }
  if (norm.includes("fitness") || norm.includes("wellness") || norm.includes("workout") || norm.includes("yoga") || norm.includes("mental")) {
    return <Heart className={className} aria-hidden="true" />;
  }
  // Construction, Real Estate & Architecture
  if (norm.includes("construction") || norm.includes("engineering") || norm.includes("civil") || norm.includes("builder") || norm.includes("contractor")) {
    return <HardHat className={className} aria-hidden="true" />;
  }
  if (norm.includes("real estate") || norm.includes("property") || norm.includes("architecture") || norm.includes("housing") || norm.includes("facility") || norm.includes("building")) {
    return <Building2 className={className} aria-hidden="true" />;
  }
  // Science, Space & Quantum
  if (norm.includes("science") || norm.includes("research") || norm.includes("quantum") || norm.includes("nanotech") || norm.includes("biotech") || norm.includes("laboratory")) {
    return <Atom className={className} aria-hidden="true" />;
  }
  // Energy & Environment
  if (norm.includes("energy") || norm.includes("solar") || norm.includes("wind") || norm.includes("oil") || norm.includes("gas") || norm.includes("power grid") || norm.includes("battery")) {
    return <SunMedium className={className} aria-hidden="true" />;
  }
  if (norm.includes("environment") || norm.includes("climate") || norm.includes("carbon") || norm.includes("sustainable") || norm.includes("wildlife") || norm.includes("recycle")) {
    return <Leaf className={className} aria-hidden="true" />;
  }
  // Agriculture & Food
  if (norm.includes("agriculture") || norm.includes("agtech") || norm.includes("farming") || norm.includes("crop") || norm.includes("plant") || norm.includes("seed")) {
    return <Sprout className={className} aria-hidden="true" />;
  }
  if (norm.includes("food") || norm.includes("restaurant") || norm.includes("grocery") || norm.includes("beverage") || norm.includes("cooking")) {
    return <ShoppingBag className={className} aria-hidden="true" />;
  }
  // Transport, Aviation & Logistics
  if (norm.includes("aviation") || norm.includes("airline") || norm.includes("aerospace") || norm.includes("flight") || norm.includes("plane")) {
    return <Plane className={className} aria-hidden="true" />;
  }
  if (norm.includes("shipping") || norm.includes("maritime") || norm.includes("naval") || norm.includes("port")) {
    return <Anchor className={className} aria-hidden="true" />;
  }
  if (norm.includes("logistics") || norm.includes("freight") || norm.includes("supply chain") || norm.includes("delivery") || norm.includes("warehousing")) {
    return <Truck className={className} aria-hidden="true" />;
  }
  if (norm.includes("automotive") || norm.includes("vehicle") || norm.includes("car") || norm.includes("traffic") || norm.includes("mobility") || norm.includes("transport")) {
    return <Car className={className} aria-hidden="true" />;
  }
  // Commerce & Retail
  if (norm.includes("commerce") || norm.includes("retail") || norm.includes("shop") || norm.includes("store") || norm.includes("marketplace")) {
    return <ShoppingBag className={className} aria-hidden="true" />;
  }
  // Education & Books
  if (norm.includes("education") || norm.includes("edtech") || norm.includes("school") || norm.includes("university") || norm.includes("learning") || norm.includes("tutoring")) {
    return <GraduationCap className={className} aria-hidden="true" />;
  }
  if (norm.includes("book") || norm.includes("publishing") || norm.includes("reading") || norm.includes("document") || norm.includes("literature")) {
    return <BookOpen className={className} aria-hidden="true" />;
  }
  // Jobs & HR
  if (norm.includes("job") || norm.includes("career") || norm.includes("recruitment") || norm.includes("hiring") || norm.includes("workforce") || norm.includes("freelanc") || norm.includes("hr")) {
    return <Briefcase className={className} aria-hidden="true" />;
  }
  if (norm.includes("team") || norm.includes("people") || norm.includes("employee") || norm.includes("consulting") || norm.includes("volunteer")) {
    return <Users className={className} aria-hidden="true" />;
  }
  // News & Media
  if (norm.includes("news") || norm.includes("media") || norm.includes("journalism") || norm.includes("broadcast")) {
    return <Newspaper className={className} aria-hidden="true" />;
  }
  // Hardware & Devices
  if (norm.includes("hardware") || norm.includes("iot") || norm.includes("chip") || norm.includes("semiconductor") || norm.includes("electronic")) {
    return <Cpu className={className} aria-hidden="true" />;
  }
  if (norm.includes("mobile") || norm.includes("app") || norm.includes("ios") || norm.includes("android")) {
    return <Smartphone className={className} aria-hidden="true" />;
  }
  // Design, Photo, Creative
  if (norm.includes("photo") || norm.includes("camera") || norm.includes("photography")) {
    return <Camera className={className} aria-hidden="true" />;
  }
  if (norm.includes("design") || norm.includes("creative") || norm.includes("ui") || norm.includes("art") || norm.includes("animation")) {
    return <Palette className={className} aria-hidden="true" />;
  }
  // Marketing & SEO
  if (norm.includes("marketing") || norm.includes("adtech") || norm.includes("growth") || norm.includes("advertising")) {
    return <Megaphone className={className} aria-hidden="true" />;
  }
  if (norm.includes("seo") || norm.includes("search")) {
    return <Search className={className} aria-hidden="true" />;
  }
  // Productivity & SaaS
  if (norm.includes("productivity") || norm.includes("workflow") || norm.includes("saas") || norm.includes("automation")) {
    return <Zap className={className} aria-hidden="true" />;
  }
  if (norm.includes("manufacturing") || norm.includes("factory") || norm.includes("industrial")) {
    return <Factory className={className} aria-hidden="true" />;
  }
  if (norm.includes("featured") || norm.includes("top")) {
    return <Sparkles className={className} aria-hidden="true" />;
  }

  return <Folder className={className} aria-hidden="true" />;
}
