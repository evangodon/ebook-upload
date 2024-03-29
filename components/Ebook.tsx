import { EbookFile } from "@/utils/types.ts";

type Props = {
  ebook: EbookFile;
};

// TODO: clean up file name

export const Ebook = ({ ebook }: Props) => {
  const isNew = ebook.modtime
    ? ebook.modtime >= new Date(Date.now() - 5000 * 60)
    : false;

  return (
    <li class="ebook">
      <div class="filename-info">
        <h6 class="filename">{ebook.name}</h6>
        {isNew && <span class="new-indicator">New</span>}
      </div>
      <a download class="download-button" href={`ebooks/${ebook.name}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-download"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </a>
    </li>
  );
};
