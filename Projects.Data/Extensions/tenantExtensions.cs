using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Data.Repositories;
using Projects.Entities.Membership;

namespace Projects.Data.Extensions
{
    public static class tenantExtensions
    {
        public static tbl_tenant GetSingleByTenantKey(this IEntityBaseRepository<tbl_tenant> tenantRepository, string tenantkey)
        {
            return tenantRepository.GetAll().FirstOrDefault(x => x.tenant_key == tenantkey);
        }

        public static tbl_tenant GetSingleByTenantID(this IEntityBaseRepository<tbl_tenant> tenantRepository, int tenantid)
        {
            return tenantRepository.GetAll().FirstOrDefault(x => x.id == tenantid);
        }

    }
}
