using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.MasterData;
using Projects.Entities.Membership;
using Projects.Services.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Projects.Data.Extensions;
using Projects.Library;
using Projects.Entities.Projects;

namespace Projects.Services
{
    public class MembershipService : IMembershipService
    {
        #region Variables
        private readonly IEntityBaseRepository<tbl_user> _userRepository;
        private readonly IEntityBaseRepository<tbl_tenant> _tenantRepository;
        private readonly IEntityBaseRepository<tbl_roles> _roleRepository;
        private readonly IEntityBaseRepository<tbl_user_role> _userRoleRepository;
        private readonly IEntityBaseRepository<tbl_menu> _menuRepository;
        public readonly IEntityBaseRepository<tbl_menu_access> _menuaccessRepository;
        public readonly IEntityBaseRepository<tbl_users_profiles> _userProfileRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IUnitOfWork _unitOfWork;
        #endregion

        public MembershipService(IEntityBaseRepository<tbl_user> userRepository,
            IEntityBaseRepository<tbl_tenant> tenantRepository,
            IEntityBaseRepository<tbl_roles> roleRepository,
            IEntityBaseRepository<tbl_user_role> userRoleRepository,
            IEntityBaseRepository<tbl_menu> menuRepository,
            IEntityBaseRepository<tbl_users_profiles> userProfileRepository,
            IEntityBaseRepository<tbl_menu_access> menuaccessRepository,
            IEncryptionService encryptionService,
            IUnitOfWork unitOfWork)
        {
            _tenantRepository = tenantRepository;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _userRoleRepository = userRoleRepository;
            _menuRepository = menuRepository;
            _userProfileRepository = userProfileRepository;
            _menuaccessRepository = menuaccessRepository;
            _encryptionService = encryptionService;
            _unitOfWork = unitOfWork;
        }

        #region IMembershipService Implementation

        public MembershipContext ValidateUser(string userid, string password)
        {
            var membershipCtx = new MembershipContext();

            var user = _userRepository.GetSingleByUsername(userid);
            if (user != null && isUserValid(user, password))
            {
                var userRoles = GetUserRoles(user.userid);
                membershipCtx.User = user;

                var identity = new GenericIdentity(user.userid);
                membershipCtx.Principal = new GenericPrincipal(
                    identity,
                    userRoles.Select(x => x.Name).ToArray());
            }

            if (!isTenantAccountValid(user))
            {
                var tenant = _tenantRepository.GetSingleByTenantID(user.tenant_id);
                throw new Exception("Tenant (Key: " + tenant.tenant_key + ") Account is Expired!");
            }

            return membershipCtx;
        }

        public tbl_tenant CreateTenant(string tenantkey, string tenantname, int tenanttype, string contactperson,
            string email, string contactno, string altcontactno, string password, int[] roles, DateTime accountvalidtill)
        {
            var existingTenant = _tenantRepository.GetSingleByTenantKey(tenantkey);

            if (existingTenant != null)
            {
                throw new Exception("Tenant is already registered!");
            }

            var passwordSalt = _encryptionService.CreateSalt();

            var newtenant = new tbl_tenant()
            {
                tenant_key = tenantkey,
                tenant_name = tenantname,
                tenant_type = tenanttype,
                contact_person = contactperson,
                email = email,
                contact_no = contactno,
                alt_contact_no = altcontactno,
                IsLocked = false,
                account_valid_till = accountvalidtill,
                date_created = DateTime.Now,
                created_by = 1,
                date_modified = DateTime.Now,
                modified_by = 1
            };

            var newuser = new tbl_user()
            {
                userid = tenantkey,
                user_name = tenantname,
                salt = passwordSalt,
                email = email,
                is_locked = false,
                is_tenant = true,
                password = _encryptionService.EncryptPassword(password, passwordSalt),
                date_created = DateTime.Now,
                date_modified = DateTime.Now
            };



            _tenantRepository.Add(newtenant);
            _userRepository.Add(newuser);

            _unitOfWork.Commit();

            if (roles != null || roles.Length > 0)
            {
                foreach (var role in roles)
                {
                    addUserToRole(newuser, role);
                }
            }
            _unitOfWork.Commit();

            return newtenant;
        }

        public tbl_tenant UpdateTenant(string tenantkey, string domain, string contactperson, string pan, string tin, string vat,
            string email, string contactno, string altcontactno, int? financestartmonth, string bankaccountno, string bankname, string bankbranch, string ifsc,
            string address, int? city, int? state, int? country, int? zip, string comments, byte[] logo, string imagetype)
        {
            try
            {
                var existingTenant = _tenantRepository.GetSingleByTenantKey(tenantkey);
                var existingUser = _tenantRepository.GetSingleByTenantKey(tenantkey);

                if (existingTenant == null)
                {
                    throw new Exception("Tenant does not exist");
                }
                else
                {
                    existingTenant.domain = domain;
                    existingTenant.pan = pan;
                    existingTenant.tin = tin;
                    existingTenant.vat = vat;
                    existingTenant.email = email;
                    existingTenant.contact_no = contactno;
                    existingTenant.alt_contact_no = altcontactno;
                    existingTenant.address = address;
                    existingTenant.country = country;
                    existingTenant.state = state;
                    existingTenant.city = city;
                    existingTenant.zip = zip;
                    existingTenant.bank_account_no = bankaccountno;
                    existingTenant.bank_name = bankname;
                    existingTenant.bank_branch = bankbranch;
                    existingTenant.ifsc_code = ifsc;
                    existingTenant.finance_start_month = financestartmonth;
                    existingTenant.comments = comments;
                    existingTenant.logo = logo;
                    existingTenant.logo_image_type = imagetype;
                    existingTenant.date_modified = DateTime.Now;
                    _tenantRepository.Edit(existingTenant);
                    var existinguser = _userRepository.GetAll().Where(x => x.userid == existingTenant.tenant_key).FirstOrDefault();
                    existinguser.email = email;
                    existinguser.date_modified = DateTime.Now;
                    _userRepository.Edit(existinguser); 
                    _unitOfWork.Commit();

                }

                return existingTenant;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public tbl_user CreateUser(int tenantid, string userid, string user_name, string email, string password, int[] roles, bool istenant)
        {
            var existingUser = _userRepository.GetSingleByUsername(userid);

            if (existingUser != null)
            {
                if (existingUser.user_name == user_name)
                {
                    throw new Exception("Username is already in use");
                }
                else if (existingUser.email == email)
                {
                    throw new Exception("Email is already in use");
                }
            }


            var passwordSalt = _encryptionService.CreateSalt();

            var user = new tbl_user()
            {
                tenant_id = tenantid,
                userid = userid,
                user_name = user_name,
                salt = passwordSalt,
                email = email.ToLower(),
                is_locked = false,
                is_tenant = istenant,
                password = _encryptionService.EncryptPassword(password, passwordSalt),
                date_created = DateTime.Now,
                date_modified = DateTime.Now
            };
             
            var saveUserProfile = new tbl_users_profiles
            {
                tenant_id = tenantid,
                userid = userid,
                user_name = user_name,
                email = email.ToLower()
            };
            _userRepository.Add(user);
            _userProfileRepository.Add(saveUserProfile);
            _unitOfWork.Commit();

            if (roles != null || roles.Length > 0)
            {
                foreach (var role in roles)
                {
                    addUserToRole(user, role);
                }
            }
            _unitOfWork.Commit();

            return user;
        }

        public tbl_user UpdateUser(int id, string UserName, string email, int roles, DateTime date_modified)
        {
            try
            {
                var existingUser = _userRepository.GetSingle(id);

                if (existingUser == null)
                {
                    throw new Exception("User does not exist");
                }
                else if (existingUser.is_tenant == false)
                {

                    existingUser.user_name = UserName;
                    existingUser.email = email;
                    existingUser.date_modified = DateTime.Now;
                    updateUserRole(existingUser.id, roles);

                    _userRepository.Edit(existingUser);

                    _unitOfWork.Commit();
                }
                else
                {
                    existingUser.user_name = UserName;
                    existingUser.email = email;
                    existingUser.date_modified = DateTime.Now;
                    updateUserRole(existingUser.id, roles);
                    _userRepository.Edit(existingUser);

                    var tenantexiting = _tenantRepository.GetAll().Where(x => x.id == existingUser.tenant_id).FirstOrDefault();
                    if (tenantexiting == null) throw new Exception("tenant does not exist");
                    else
                    {
                        tenantexiting.tenant_name = UserName;
                        tenantexiting.email = email;
                        tenantexiting.date_modified = DateTime.Now;
                        updateUsertenantRole(tenantexiting.id, roles);
                        _tenantRepository.Edit(tenantexiting);
                        _unitOfWork.Commit();

                    }
                }

                return existingUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<tbl_user> GetAllUsers()
        {
            var _result = _userRepository.GetAll();

            return _result.ToList();
        }

        public tbl_user DeleteUser(string userid)
        {
            var existingUser = _userRepository.GetSingleByUsername(userid);

            if (existingUser != null)
            {
                existingUser.is_locked = true;

                _userRepository.Edit(existingUser);

                _unitOfWork.Commit();
            }
            return existingUser;
        }

        public tbl_user UnlockUser(string userid)
        {
            var existingUser = _userRepository.GetSingleByUsername(userid);
            if (existingUser != null)
            {
                existingUser.is_locked = false;
                _userRepository.Edit(existingUser);
                _unitOfWork.Commit();
            }
            return existingUser;
        }
        public tbl_user ChangePassword(string userid, string oldpwd, string password)
        {
            try
            {
                var passwordSalt = _encryptionService.CreateSalt();

                var existingUser = _userRepository.GetSingleByUsername(userid);

                if (existingUser == null)
                {
                    throw new Exception("User does not exist");
                }
                else
                {

                    existingUser.salt = passwordSalt;
                    existingUser.password = _encryptionService.EncryptPassword(password, passwordSalt);
                    existingUser.date_modified = DateTime.Now;

                    _userRepository.Edit(existingUser);

                    _unitOfWork.Commit();
                }

                return existingUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public tbl_user GetUser(int userId)
        {
            return _userRepository.GetSingle(userId);
        }

        public List<tbl_roles> GetUserRoles(string userid)
        {
            List<tbl_roles> _result = new List<tbl_roles>();

            var existingUser = _userRepository.GetSingleByUsername(userid);

            if (existingUser != null)
            {
                foreach (var userRole in existingUser.UserRoles)
                {
                    _result.Add(userRole.Roles);
                }
            }

            return _result.Distinct().ToList();
        }

        public tbl_menu_access Assignmenu(string userid)
        {
            var user = _userRepository.GetSingleByUsername(userid);
            var newmenuaccess = new tbl_menu_access();

            if (user != null)
            {
                var menulist = _menuRepository.GetAll().ToList();
                foreach (var menu in menulist)
                {
                    if (user.tenant_id == 1)
                    {
                        newmenuaccess = new tbl_menu_access()
                        {
                            menu_id = menu.id,
                            user_id = user.id,
                            tenant_id = user.tenant_id,
                            is_active = true
                        };
                        _menuaccessRepository.Add(newmenuaccess);
                        _unitOfWork.Commit();
                    }
                    else 
                    {
                        if (menu.parent_menu != 3 && menu.menu_order!=3)
                        {
                            newmenuaccess = new tbl_menu_access()
                            {
                                menu_id = menu.id,
                                user_id = user.id,
                                tenant_id = user.tenant_id,
                                is_active = true
                            };
                            _menuaccessRepository.Add(newmenuaccess);
                            _unitOfWork.Commit();
                        }
                    }
                   
                    //else
                    //{
                    //    if (menu.name != "Projects")
                    //    {
                    //        if (menu.parent_menu != 3)
                    //        {
                    //            newmenuaccess = new tbl_menu_access()
                    //            {
                    //                menu_id = menu.id,
                    //                user_id = user.id,
                    //                tenant_id = user.tenant_id,
                    //                is_active = true
                    //            };
                    //            _menuaccessRepository.Add(newmenuaccess);
                    //            _unitOfWork.Commit();
                    //        }
                    //    }
                    //}

                }
            }
            return newmenuaccess;
        }

        //public tbl_menu_access SaveEditMenuAccess(int[] menuAccess)
        //{
        //    //var user = _userRepository.GetSingle(menuAccess[0].user_id);
        //    var newmenuaccess = new tbl_menu_access();

        //    return newmenuaccess;
        //}


        #endregion

        #region Helper methods
        private void addUserToRole(tbl_user user, int roleId)
        {
            var role = _roleRepository.GetSingle(roleId);
            if (role == null)
                throw new ApplicationException("Role doesn't exist.");

            var userRole = new tbl_user_role()
            {
                RoleId = role.id,
                UserId = user.id
            };
            _userRoleRepository.Add(userRole);
        }

        private void updateUserRole(int userid, int roleId)
        {
            var userRole = _userRoleRepository.GetSingleByUserID(userid);
            if (userRole != null)
            {
                userRole.RoleId = roleId;
                _userRoleRepository.Edit(userRole);
            }
        }

        private void updateUsertenantRole(int id, int roleId)
        {
            var userRole = _userRoleRepository.GetSingleByUserID(id);
            if (userRole != null)
            {
                userRole.RoleId = roleId;
                _userRoleRepository.Edit(userRole);
            }
        }

        private bool isPasswordValid(tbl_user user, string password)
        {
            return string.Equals(_encryptionService.EncryptPassword(password, user.salt), user.password);
        }

        private bool isUserValid(tbl_user user, string password)
        {
            if (isPasswordValid(user, password))
            {
                return !user.is_locked;
            }

            return false;
        }

        private bool isTenantAccountValid(tbl_user user)
        {
            var tenant = _tenantRepository.GetSingleByTenantID(user.tenant_id);
            if (tenant.account_valid_till >= DateTime.Now)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #endregion
    }
}
