using Projects.Data.Repositories;
using Projects.Entities.Membership;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Extensions
{
    public static class UserExtensions
    {
        public static tbl_user GetSingleByUsername(this IEntityBaseRepository<tbl_user> userRepository, string username)
        {
                return userRepository.GetAll().FirstOrDefault(x => x.userid == username);
        }

        public static tbl_user_role GetSingleByUserID(this IEntityBaseRepository<tbl_user_role> _userroleRepository, int userid)
        {
            return _userroleRepository.GetAll().FirstOrDefault(x => x.UserId == userid);
        }

    }
}
