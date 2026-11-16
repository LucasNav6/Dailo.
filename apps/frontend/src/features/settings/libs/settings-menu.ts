import { RiEqualizerLine, RiNotification3Line, RiShieldLine, type RemixiconComponentType } from "@remixicon/react"

export type SettingsCategory = { to: string; label: string; description: string; Icon: RemixiconComponentType }

export const settingsGroups: { title: string; items: SettingsCategory[] }[] = [
  {
    title: "Personalización",
    items: [
      { to: "/settings/preferences", label: "Preferencias", description: "Rutina, planificación y apariencia", Icon: RiEqualizerLine },
      { to: "/settings/notifications", label: "Notificaciones", description: "Recordatorios y avisos", Icon: RiNotification3Line },
    ],
  },
  {
    title: "Seguridad",
    items: [{ to: "/settings/security", label: "Seguridad y datos", description: "Almacenamiento local en este dispositivo", Icon: RiShieldLine }],
  },
]

export const settingsCategories = settingsGroups.flatMap((group) => group.items)
