using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class SettingsEntityExtension
    {
        public static void AddSettings(this tbl_settings settings, SettingsViewModel settingsVm)
        {
            settings.tenant_id = settingsVm.tenant_id;
            settings.emp_code = settingsVm.emp_code;
            settings.code_seperation = settingsVm.code_seperation;
            settings.emp_num = settingsVm.emp_num;
            


        }
    }
}