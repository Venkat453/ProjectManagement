using Projects.Data.Repositories;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Extensions
{
    public static class MenuAccessExtensions
    {
        //public static tbl_menu_access GetAllMenuAccessByUser(this IEntityBaseRepository<tbl_menu_access> menuAccessRepository, int tenantid, int userid)
        //{
        //    return menuAccessRepository.GetAll().Where(x => x.tenant_id == tenantid && x.user_id == (int)userid);
        //}

        public static tbl_menu_access GetSingleMenuAccess(this IEntityBaseRepository<tbl_menu_access> menuAccessRepository, int tenantid, int userid, int menuid)
        {
            return menuAccessRepository.GetAll().FirstOrDefault(x => x.tenant_id == tenantid && x.user_id == userid && x.menu_id == menuid);
        }
    }
}
