using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Extensions
{
    public static class ReferenceMasterExtensions
    {
        public static tbl_reference_group_master GetSingleGroupByGroupID(this IEntityBaseRepository<tbl_reference_group_master> refmastergroupRepository, int groupid)
        {
            return refmastergroupRepository.GetAll().FirstOrDefault(x => x.group_id == groupid);
        }

        public static tbl_reference_master GetAllByGroupID(this IEntityBaseRepository<tbl_reference_master> refmasterRepository, int groupid)
        {
            return refmasterRepository.GetAll().FirstOrDefault(x => x.group_id == groupid);
        }
    }
}
