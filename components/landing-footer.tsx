"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import logo from "@/assets/gselogo.png"
import Image from "next/image";

export default function LandingFooter() {
    return <footer className="border-t border-gray-200 dark:border-gray-800 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} GSE Monitor. All rights reserved.
              </p>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                GSE Trader is regulated by the Securities and Exchange Commission of Ghana.
              </p> */}
            </div>
          </div>
        </div>
      </footer>
}