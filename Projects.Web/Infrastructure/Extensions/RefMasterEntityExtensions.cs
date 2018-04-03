using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Web.Models;
using Projects.Entities.MasterData;
using Projects.Data.Repositories;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class RefMasterEntityExtensions
    {
        public static tbl_reference_master GetSingleByID(this IEntityBaseRepository<tbl_reference_master> RefMasterRepository, int id)
        {
            return RefMasterRepository.GetAll().FirstOrDefault(x => x.id == id); 
        }
    }
}