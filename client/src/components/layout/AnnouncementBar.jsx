import { useSettings } from '../../features/settings/hooks';

export default function AnnouncementBar() {
  const { data: settings } = useSettings();

  if (!settings?.announcementBar?.isActive || !settings.announcementBar.text) return null;

  const content = (
    <p className="text-[11px] font-medium uppercase tracking-wide text-white sm:text-xs">
      {settings.announcementBar.text}
    </p>
  );

  return (
    <div className="flex h-9 items-center justify-center bg-black px-4 text-center">
      {settings.announcementBar.link ? (
        <a href={settings.announcementBar.link} className="link-underline">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
