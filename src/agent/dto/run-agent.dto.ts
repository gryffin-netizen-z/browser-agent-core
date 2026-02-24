export class RunAgentDto {
  url!: string;
  goal!: string;
  /** Set false để mở cửa sổ browser và xem agent thao tác (demo). Mặc định true (headless). */
  headless?: boolean;
  /** Set true để sau khi thao tác xong không đóng browser (giữ trang mở). Mặc định false. */
  keepBrowserOpen?: boolean;
}
