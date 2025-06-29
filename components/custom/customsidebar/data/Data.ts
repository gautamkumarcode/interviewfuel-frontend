import {
    BookOpen,
    Brain,
    Database,
    Globe,
    Smartphone,
    TrendingUp,
    Code2,
    FileCode,
    Hexagon,
    FileText,
    FileJson,
    Settings as LucideSettings,
    Cloud,
    CircleDot,
    TerminalSquare,
    TabletSmartphone,
    PieChart,
    Server,
    GitBranch,
    Zap,
    Cpu,
} from "lucide-react";


export const techStacks = [
    {
        category: "Frontend",
        icon: Globe,
        items: [
            { name: "JavaScript", count: 245, icon: FileCode, color: "text-yellow-500", href: "/questions/category/javascript" },
            { name: "React", count: 189, icon: Hexagon, color: "text-blue-500", href: "/questions/category/react" },
            { name: "Vue.js", count: 156, icon: BookOpen, color: "text-green-500", href: "/questions/category/vue" },
            { name: "Angular", count: 134, icon: LucideSettings, color: "text-red-500", href: "/questions/category/angular" },
            { name: "HTML/CSS", count: 98, icon: FileText, color: "text-orange-500", href: "/questions/category/html-css" },
            { name: "TypeScript", count: 167, icon: FileJson, color: "text-blue-600", href: "/questions/category/typescript" },
        ],
    },
    {
        category: "Backend",
        icon: Database,
        items: [
            { name: "Node.js", count: 198, icon: LucideSettings, color: "text-green-600", href: "/questions/category/nodejs" },
            { name: "Python", count: 234, icon: Code2, color: "text-blue-400", href: "/questions/category/python" },
            { name: "Java", count: 287, icon: Hexagon, color: "text-red-600", href: "/questions/category/java" },
            { name: "C#", count: 145, icon: FileCode, color: "text-purple-500", href: "/questions/category/csharp" },
            { name: "Go", count: 89, icon: TerminalSquare, color: "text-cyan-500", href: "/questions/category/go" },
            { name: "PHP", count: 123, icon: FileText, color: "text-indigo-500", href: "/questions/category/php" },
        ],
    },
    {
        category: "Mobile",
        icon: Smartphone,
        items: [
            { name: "React Native", count: 87, icon: TabletSmartphone, color: "text-blue-500", href: "/questions/category/react-native" },
            { name: "Flutter", count: 92, icon: Smartphone, color: "text-blue-400", href: "/questions/category/flutter" },
            { name: "iOS (Swift)", count: 76, icon: Smartphone, color: "text-gray-700", href: "/questions/category/ios" },
            { name: "Android (Kotlin)", count: 84, icon: Smartphone, color: "text-green-500", href: "/questions/category/android" },
        ],
    },
    {
        category: "Data Science",
        icon: TrendingUp,
        items: [
            { name: "Machine Learning", count: 156, icon: Cpu, color: "text-purple-600", href: "/questions/category/ml" },
            { name: "Data Analysis", count: 134, icon: PieChart, color: "text-pink-500", href: "/questions/category/data-analysis" },
            { name: "SQL", count: 198, icon: Server, color: "text-orange-600", href: "/questions/category/sql" },
            { name: "Statistics", count: 89, icon: BookOpen, color: "text-teal-500", href: "/questions/category/statistics" },
        ],
    },
    {
        category: "System Design",
        icon: Brain,
        items: [
            { name: "Scalability", count: 67, icon: Cloud, color: "text-gray-600", href: "/questions/category/scalability" },
            { name: "Microservices", count: 54, icon: GitBranch, color: "text-indigo-600", href: "/questions/category/microservices" },
            { name: "Load Balancing", count: 43, icon: Zap, color: "text-yellow-600", href: "/questions/category/load-balancing" },
            { name: "Caching", count: 38, icon: CircleDot, color: "text-red-400", href: "/questions/category/caching" },
        ],
    },
];