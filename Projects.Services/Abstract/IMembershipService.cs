using Projects.Entities;
using Projects.Entities.Membership;
using Projects.Services.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;

namespace Projects.Services
{
    public interface IMembershipService
    {
        MembershipContext ValidateUser(string userid, string password);
        tbl_tenant CreateTenant(string tenantkey, string tenantname, int tenanttype, string contactperson,
            string email, string contactno, string altcontactno, string password, int[] roles, DateTime accountvalidtill);
        tbl_tenant UpdateTenant(string tenantkey, string domain, string contactperson, string pan, string tin, string vat,
            string email, string contactno, string altcontactno, int? financestartmonth, string bankaccountno, string bankname, string bankbranch, string ifsc,
            string address, int? city, int? state, int? country, int? zip, string comments, byte[] logo, string imagetype);
        tbl_user CreateUser(int tenantid, string username, string user_name, string email, string password, int[] roles, bool istenant);
        tbl_user UpdateUser(int id, string UserName, string email, int roles, DateTime date_modified);
        tbl_user DeleteUser(string username);
        tbl_user UnlockUser(string userid);
        tbl_user GetUser(int userId);
        tbl_user ChangePassword(string userid, string oldpwd, string password);
        List<tbl_roles> GetUserRoles(string userid);
        tbl_menu_access Assignmenu(string userid);
        List<tbl_user> GetAllUsers();
        //tbl_user ResetPassword(int userID, string newPassword);
        //tbl_user UnlockUser(int userid);
        //tbl_menu_access SaveEditMenuAccess(object );


    }
}
