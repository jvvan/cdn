import { readFileSync } from "fs";
import { resolve } from "path";

export interface Config {
  port: number;
  hostname: string;
  mongo: string;
  discord: {
    client_secret: string;
    client_id: string;
    callback: string;
    scope: string[];
    prompt: string;
  };
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      httpOnly: boolean;
    };
  };
  meta: {
    name: string;
    title: string;
    baseurl: string;
    color: string;
  };
  files: {
    storage: string;
    temp: string;
    limits: {
      fileSize: number;
    };
  };
}
let config: Config | null = null;

export function getConfig() {
  if (config) return config;

  const filePath = resolve(import.meta.dirname, "../../../config.json");
  config = JSON.parse(readFileSync(filePath, "utf-8")) as Config;
  return config;
}
