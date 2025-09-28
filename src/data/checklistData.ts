import { ChecklistItemType } from "@/types/checklist";

export const defaultChecklistItems: ChecklistItemType[] = [
  // Pre-Installation Phase
  {
    id: "pre-1",
    phase: "Pre-Installation",
    item: "Define purpose and business/technical need",
    checked: false,
    comment: ""
  },
  {
    id: "pre-2",
    phase: "Pre-Installation",
    item: "Verify system requirements (OS, CPU, RAM, Disk)",
    checked: false,
    comment: ""
  },
  {
    id: "pre-3",
    phase: "Pre-Installation",
    item: "Check network connectivity and firewall settings",
    checked: false,
    comment: ""
  },
  {
    id: "pre-4",
    phase: "Pre-Installation",
    item: "Obtain necessary licenses and credentials",
    checked: false,
    comment: ""
  },
  {
    id: "pre-5",
    phase: "Pre-Installation",
    item: "Review installation documentation",
    checked: false,
    comment: ""
  },
  {
    id: "pre-6",
    phase: "Pre-Installation",
    item: "Plan backup and rollback strategy",
    checked: false,
    comment: ""
  },

  // Installation Phase
  {
    id: "install-1",
    phase: "Installation",
    item: "Backup current system state",
    checked: false,
    comment: ""
  },
  {
    id: "install-2",
    phase: "Installation",
    item: "Download and verify software integrity",
    checked: false,
    comment: ""
  },
  {
    id: "install-3",
    phase: "Installation",
    item: "Run installation with appropriate privileges",
    checked: false,
    comment: ""
  },
  {
    id: "install-4",
    phase: "Installation",
    item: "Configure initial settings and parameters",
    checked: false,
    comment: ""
  },
  {
    id: "install-5",
    phase: "Installation",
    item: "Apply security patches and updates",
    checked: false,
    comment: ""
  },
  {
    id: "install-6",
    phase: "Installation",
    item: "Set up user accounts and permissions",
    checked: false,
    comment: ""
  },

  // Post-Installation Phase
  {
    id: "post-1",
    phase: "Post-Installation",
    item: "Verify software functionality and performance",
    checked: false,
    comment: ""
  },
  {
    id: "post-2",
    phase: "Post-Installation",
    item: "Test integration with existing systems",
    checked: false,
    comment: ""
  },
  {
    id: "post-3",
    phase: "Post-Installation",
    item: "Configure monitoring and logging",
    checked: false,
    comment: ""
  },
  {
    id: "post-4",
    phase: "Post-Installation",
    item: "Document configuration and settings",
    checked: false,
    comment: ""
  },
  {
    id: "post-5",
    phase: "Post-Installation",
    item: "Train users and provide documentation",
    checked: false,
    comment: ""
  },
  {
    id: "post-6",
    phase: "Post-Installation",
    item: "Schedule regular maintenance and updates",
    checked: false,
    comment: ""
  }
];