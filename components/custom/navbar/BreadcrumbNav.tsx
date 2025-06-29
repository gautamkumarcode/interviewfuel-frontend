"use client"

import type React from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Home, User } from "lucide-react"
import { usePathname } from "next/navigation"

const routeConfig: Record<string, { label: string; icon?: React.ComponentType<{ className?: string }> }> = {
  "/": { label: "Home", icon: Home },
  "/practice": { label: "Practice Session" },
  "/analytics": { label: "Analytics Dashboard" },
  "/questions": { label: "Questions" },
  "/profile": { label: "Profile", icon: User },
  "/settings": { label: "Settings" },
}

const categoryLabels: Record<string, string> = {
  javascript: "JavaScript",
  react: "React",
  vue: "Vue.js",
  angular: "Angular",
  "html-css": "HTML/CSS",
  typescript: "TypeScript",
  nodejs: "Node.js",
  python: "Python",
  java: "Java",
  csharp: "C#",
  go: "Go",
  php: "PHP",
  "react-native": "React Native",
  flutter: "Flutter",
  ios: "iOS (Swift)",
  android: "Android (Kotlin)",
  ml: "Machine Learning",
  "data-analysis": "Data Analysis",
  sql: "SQL",
  statistics: "Statistics",
  scalability: "Scalability",
  microservices: "Microservices",
  "load-balancing": "Load Balancing",
  caching: "Caching",
}

export function BreadcrumbNav() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }[] => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: { label: string; href: string; icon?: React.ComponentType<{ className?: string }> }[] = [
      { label: "Home", href: "/", icon: Home },
    ]

    // If we're on the home page, return just home
    if (pathname === "/") {
      return breadcrumbs
    }

    let currentPath = ""

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      currentPath += `/${segment}`

      // Handle questions routes
      if (segment === "questions") {
        const nextSegment = segments[i + 1]

        if (nextSegment) {
          // Check if it's a question ID (numeric)
          if (/^\d+$/.test(nextSegment)) {
            breadcrumbs.push({ label: "Questions", href: "/questions" })
            breadcrumbs.push({
              label: `Question #${nextSegment}`,
              href: `/questions/${nextSegment}`,
            })
            i++ // Skip next iteration since we handled both segments
          } else {
            // It's a category
            const categoryLabel =
              categoryLabels[nextSegment] ||
              nextSegment.charAt(0).toUpperCase() + nextSegment.slice(1).replace("-", " ")
            breadcrumbs.push({ label: "Questions", href: "/questions" })
            breadcrumbs.push({
              label: categoryLabel,
              href: `/questions/${nextSegment}`,
            })
            i++ // Skip next iteration
          }
        } else {
          breadcrumbs.push({ label: "Questions", href: "/questions" })
        }
      }
      // Handle other configured routes
      else if (routeConfig[currentPath]) {
        breadcrumbs.push({
          label: routeConfig[currentPath].label,
          href: currentPath,
          icon: routeConfig[currentPath].icon,
        })
      }
      // Handle dynamic segments
      else if (!segments[i - 1] || segments[i - 1] !== "questions") {
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ")
        breadcrumbs.push({ label, href: currentPath })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && (
              <BreadcrumbSeparator className="mx-2">
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="font-medium text-gray-900 flex items-center gap-2">
                  {crumb.icon && <crumb.icon className="h-4 w-4" />}
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={crumb.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  {crumb.icon && <crumb.icon className="h-4 w-4" />}
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
