-- Insert some dummy checklist data
INSERT INTO public.checklist_items (phase, item, checked, comment) VALUES
('Pre-Installation', 'Define purpose and business/technical need', true, 'Completed for CRM system implementation'),
('Pre-Installation', 'Verify system requirements (OS, CPU, RAM, Disk)', true, 'Windows Server 2022, 16GB RAM, 500GB SSD verified'),
('Pre-Installation', 'Check network connectivity and firewall settings', false, 'Need to configure ports 443 and 8080'),
('Pre-Installation', 'Backup existing system configuration', true, 'Full backup created on external drive'),
('Pre-Installation', 'Download and verify software integrity', false, ''),
('Installation', 'Create installation directory', true, 'Created at C:\Applications\CRM'),
('Installation', 'Run installer as administrator', false, ''),
('Installation', 'Configure database connections', false, 'Will use PostgreSQL on local server'),
('Installation', 'Set up user accounts and permissions', false, ''),
('Installation', 'Install required dependencies', true, '.NET Framework 4.8 installed'),
('Post-Installation', 'Verify all services are running', false, ''),
('Post-Installation', 'Test basic functionality', false, ''),
('Post-Installation', 'Configure monitoring and logging', false, 'Need to set up log rotation'),
('Post-Installation', 'Create backup schedule', false, ''),
('Post-Installation', 'Update documentation', true, 'Installation guide updated with new steps');