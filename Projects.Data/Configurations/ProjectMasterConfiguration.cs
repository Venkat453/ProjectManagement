using Projects.Entities.Projects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Configurations
{
    public class ProjectMasterConfiguration : EntityBaseConfiguration<tbl_project_master>
    {
        public ProjectMasterConfiguration()
        {
            Property(pm => pm.id).IsRequired();
            Property(pm => pm.tenant_id).IsRequired();
            Property(pm => pm.project_name).IsRequired().HasMaxLength(30);
            Property(pm => pm.project_description).IsRequired().HasMaxLength(100);
            Property(pm => pm.project_customer).HasMaxLength(30);

        }
    }
}
