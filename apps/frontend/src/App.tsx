import { RiComputerFill, RiComputerLine, RiMoonFill, RiMoonLine, RiSunFill, RiSunLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme, type Theme } from "@/lib/theme";

const options = [
  { value: "light", label: "Claro", Line: RiSunLine, Fill: RiSunFill },
  { value: "dark", label: "Oscuro", Line: RiMoonLine, Fill: RiMoonFill },
  { value: "system", label: "Sistema", Line: RiComputerLine, Fill: RiComputerFill },
] as const;

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider>
      <main className="flex min-h-svh flex-col items-start gap-6 p-6">
        <h1 className="text-2xl font-semibold">Dailo</h1>
        <Tabs value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          <TabsList>
            {options.map(({ value, label, Line, Fill }) => (
              <TabsTrigger key={value} value={value}>
                {theme === value ? <Fill /> : <Line />}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button>Acción principal</Button>
      </main>
    </TooltipProvider>
  );
}
