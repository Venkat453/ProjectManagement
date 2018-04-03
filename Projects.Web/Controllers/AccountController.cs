using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.Membership;
using Projects.Services;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Projects.Web.Controllers;
using AutoMapper;
using System.IO;
using System.Web;
using System.Configuration;
using System.Net.Http.Headers;
using Projects.Entities.Projects;

namespace Projects.Web.Controllers
{
    public class MytenantUserlist
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string userid { get; set; }

    }
    public class MytenantUserlist1
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string userid { get; set; }

    }
    public class lockuser
    {
        public string userid { get; set; }

    }

    //[Authorize(Roles = "Admin")]
    [RoutePrefix("api/account")]
    public class AccountController : ApiControllerBase
    {
        private readonly IMembershipService _membershipService;
        public readonly IEntityBaseRepository<tbl_tenant> _tenantRepository;
        public readonly IEntityBaseRepository<tbl_users_profiles> _userProfileRepository;
        public readonly IEntityBaseRepository<tbl_user> _userRepository;
        public readonly IEntityBaseRepository<tbl_user_role> _userrolesRepository;
        public readonly IEntityBaseRepository<tbl_roles> _rolesRepository;
        private readonly IEncryptionService _encryptionService;

        public AccountController(IMembershipService membershipService,
            IEntityBaseRepository<tbl_tenant> tenantRepository,
            IEntityBaseRepository<tbl_user> userRepository,
            IEntityBaseRepository<tbl_user_role> userrolesRepository,
            IEntityBaseRepository<tbl_roles> rolesRepository,
            IEntityBaseRepository<tbl_users_profiles> userProfileRepository, 
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IEncryptionService encryptionService,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _membershipService = membershipService;
            _tenantRepository = tenantRepository;
            _userRepository = userRepository;
            _userrolesRepository = userrolesRepository;
            _rolesRepository = rolesRepository;
            _encryptionService = encryptionService;
            _userProfileRepository = userProfileRepository;
        }

        [AllowAnonymous]
        [Route("authenticate")]
        [HttpPost]
        public HttpResponseMessage Login(HttpRequestMessage request, LoginViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (ModelState.IsValid)
                {
                    MembershipContext _userContext = _membershipService.ValidateUser(user.userid, user.password);

                    if (_userContext.User != null)
                    {
                        int roleid = 0;
                        roleid = _userContext.User.UserRoles.ToList()[0].RoleId;
                        var tenant = _tenantRepository.GetSingle(_userContext.User.tenant_id);
                        if (_userContext.User.is_tenant)
                        {
                            response = request.CreateResponse(HttpStatusCode.OK, new
                            {
                                success = true,
                                user_id = _userContext.User.id,
                                username = _userContext.User.user_name,
                                roleid = roleid,
                                is_tenant = _userContext.User.is_tenant,
                                tenantid = _userContext.User.tenant_id,
                                tenantkey = tenant.tenant_key,
                                tenantemail = tenant.email,
                                tenantlogo = tenant.logo,
                                tenantlogoimagetype = tenant.logo_image_type
                            });
                        }
                        else
                        {
                            var userdetails = _userProfileRepository.GetAll().Where(x => x.userid == user.userid).FirstOrDefault();
                            response = request.CreateResponse(HttpStatusCode.OK, new
                            {
                                success = true,
                                user_id = _userContext.User.id,
                                username = _userContext.User.user_name,
                                roleid = roleid,
                                is_tenant = _userContext.User.is_tenant,
                                tenantid = _userContext.User.tenant_id,
                                tenantkey = tenant.tenant_key,
                                tenantemail = tenant.email, 
                                userlogo = userdetails.logo,
                                userlogofiletype = userdetails.logo_image_type
                            });
                        }
                       
                        

                        GlobalVars.gvTenantKey = tenant.tenant_key;
                        GlobalVars.gvTenantEmail = tenant.email;
                        GlobalVars.gvUserID = _userContext.User.id;
                        GlobalVars.gvUserName = _userContext.User.user_name;
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }
                }
                else
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                }
                return response;
            });
        }

        [AllowAnonymous]
        [Route("register")]
        [HttpPost]
        public HttpResponseMessage Register(HttpRequestMessage request, UsersRegistrationViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    tbl_user _user = _membershipService.CreateUser(user.tenant_id, user.userid, user.UserName, user.Email, user.password, new int[] { user.Roleid }, user.is_tenant);

                    string toMailList = null;
                    string tomailtocc = null;

                    if (_user != null)
                    {
                        //List<string> toMailList = new List<string>{ };

                        GlobalVars.gvUserID = _user.id;
                        GlobalVars.gvUserName = _user.user_name;


                        if (user.mail2tenant)
                        {
                            //toMailList.Add(GlobalVars.gvTenantEmail);
                            toMailList = GlobalVars.gvTenantEmail;
                        }

                        if (user.mail2user)
                        {
                            //toMailList.Add(user.Email);
                            // toMailList = toMailList.ToString() + "," + user.Email.ToString();
                            toMailList = user.Email;
                            tomailtocc = GlobalVars.gvTenantEmail;
                        }

                        if (toMailList != null)
                        {
                            string vSubject = "Welcome to Projects!";
                            string vBody = File.ReadAllText(HttpContext.Current.Server.MapPath("~") + "/Templates/Email/user_registration_email.html");
                            vBody = vBody.Replace("!User", GlobalVars.gvUserName.ToString());
                            vBody = vBody.Replace("!uid", user.userid.ToString());
                            vBody = vBody.Replace("!pwd", user.password.ToString());

                            Library.Email tapCloudsEmail = new Library.Email();
                           // bool emailsent = vEmail.SendMail(toMailList, Convert.ToString(ConfigurationManager.AppSettings["FromEmail"]), "ICD", tomailtocc, vSubject, vBody);
                            bool emailsent = tapCloudsEmail.SendMail(toMailList, Convert.ToString(ConfigurationManager.AppSettings["FromEmail"]), "Projects",
                             tomailtocc, vSubject, vBody);
                        }


                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }
                }

                return response;
            });
        }

        [AllowAnonymous]
        [Route("UpdateUser")]
        [HttpPost]
        public HttpResponseMessage UpdateUser(HttpRequestMessage request, UsersViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    _membershipService.UpdateUser(user.id, user.user_name, user.email, user.role_id, user.date_modified);
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });

                }
                return response;
            });

        }

        [AllowAnonymous]
        [Route("changePWD")]
        [HttpPost]
        public HttpResponseMessage changePWD(HttpRequestMessage request, LoginViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    tbl_user _user = _membershipService.ChangePassword(user.userid, user.oldpassword, user.password);

                    if (_user != null)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }
                }

                return response;
            });
        }

        [Route("GetMyUsers/{tenantid:int}")]
        public IHttpActionResult GetMyUsers(HttpRequestMessage request, int tenantid)
        {
            if (tenantid == 1)
            {
                var myUsers = from u in _userRepository.GetAll().AsQueryable()
                              join ur in _userrolesRepository.GetAll().AsQueryable() on u.id equals ur.id into p
                              from ur in p.DefaultIfEmpty()
                              join r in _rolesRepository.GetAll().AsQueryable() on ur.RoleId equals r.id into pr
                              from r in pr.DefaultIfEmpty()
                              where (u.tenant_id==1 && u.is_tenant==false)
                              select new
                              {
                                  id = u.id,
                                  tenant_id = u.tenant_id,
                                  userid = u.userid,
                                  user_name = u.user_name,
                                  email = u.email,
                                  roleid = r.id,
                                  role = r.Name,
                                  IsLocked = u.is_locked,
                                  IsTenant = u.is_tenant,
                                  DateCreated = u.date_created,
                                  DateModified = u.date_modified
                              };
                return Ok(myUsers);
            }
            else
            {
                var myUsers = from u in _userRepository.GetAll().AsQueryable()
                              join ur in _userrolesRepository.GetAll().AsQueryable() on u.id equals ur.id into p
                              from ur in p.DefaultIfEmpty()
                              join r in _rolesRepository.GetAll().AsQueryable() on ur.RoleId equals r.id into pr
                              from r in pr.DefaultIfEmpty()
                              where (u.tenant_id == tenantid && u.is_tenant==false)
                              select new
                              {
                                  id = u.id,
                                  tenant_id = u.tenant_id,
                                  userid = u.userid,
                                  user_name = u.user_name,
                                  email = u.email,
                                  roleid = r.id,
                                  role = r.Name,
                                  IsLocked = u.is_locked,
                                  IsTenant = u.is_tenant,
                                  DateCreated = u.date_created,
                                  DateModified = u.date_modified
                              };
                return Ok(myUsers);
            }
        }

        [Route("GetAllUsers")]
        public HttpResponseMessage GetAllUsers(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var allUsers = _userRepository.GetAll().OrderBy(x => x.tenant_id);
                IEnumerable<UsersViewModel> userVM = Mapper.Map<IEnumerable<tbl_user>, IEnumerable<UsersViewModel>>(allUsers);
                response = request.CreateResponse<IEnumerable<UsersViewModel>>(HttpStatusCode.OK, userVM);
                return response;
            });
        }
    
        [AllowAnonymous]
        [Route("getroles")]
        public HttpResponseMessage GetRoles(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var rolesList = _rolesRepository.GetAll();
                IEnumerable<RolesViewModel> rolesVM = Mapper.Map<IEnumerable<tbl_roles>, IEnumerable<RolesViewModel>>(rolesList);
                response = request.CreateResponse<IEnumerable<RolesViewModel>>(HttpStatusCode.OK, rolesVM);
                return response;
            });
        }

        [HttpPost]
        [Route("DeleteUser")]
        public HttpResponseMessage DeleteUser(HttpRequestMessage request, string user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                tbl_user _user = _membershipService.DeleteUser(user);

                if (_user != null)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }
                else
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                }

                return response;
            });
        }



        [AllowAnonymous]
        [HttpPost]
        [Route("ForgotPassword")]
        public HttpResponseMessage ForgotPassword(HttpRequestMessage request, ForgotPasswordViewModel forgotPassword)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var emailID = string.Empty;

                    var existingUser = _userRepository.GetAll().Where(x => x.email == forgotPassword.email).FirstOrDefault();

                    if (existingUser != null)
                    {
                        existingUser.password = _encryptionService.EncryptPassword(forgotPassword.password, existingUser.salt);
                        _userRepository.Edit(existingUser);
                        _unitOfWork.Commit();
                        response = request.CreateResponse(HttpStatusCode.OK);
                    }
                }

                return response;
            });
        }



        [HttpPost]
        [Route("Emailisexits")]
        public bool Emailisexits(ForgotPasswordViewModel exitsemail)
        {
            bool _userEmail = false; 
            if (exitsemail != null)
            {
                 _userEmail = _userRepository.GetAll().Any(u => u.email.ToLower() == exitsemail.email);
            }
            return _userEmail; 

        }


        [HttpPost]
        [Route("Locktenantusers")]
        public HttpResponseMessage Locktenantusers(HttpRequestMessage request, List<MytenantUserlist> users)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                for (int i = 0; i < users.Count(); i++)
                {
                    tbl_user _user = _membershipService.DeleteUser(users[i].userid);
                    if (_user != null)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }

                }

                return response;
            });
        }

        [HttpPost]
        [Route("UnLocktenantusers")]
        public HttpResponseMessage UnLocktenantusers(HttpRequestMessage request, List<MytenantUserlist1> users)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                for (int i = 0; i < users.Count(); i++)
                {
                    tbl_user _user = _membershipService.UnlockUser(users[i].userid);
                    if (_user != null)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }

                } 
                return response;
            });
        }

        [HttpPost]
        [Route("LockUser")]
        public HttpResponseMessage LockUser(HttpRequestMessage request, lockuser lockuse)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                tbl_user _user = _membershipService.DeleteUser(lockuse.userid);

                if (_user != null)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }
                else
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                }

                return response;
            });
        }  

        [HttpPost]
        [Route("UnlockUser")]
        public HttpResponseMessage UnlockUser(HttpRequestMessage request, lockuser lockuse)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                tbl_user _user = _membershipService.UnlockUser(lockuse.userid);

                if (_user != null)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }
                else
                {
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                }

                return response;
            });
        }


        [HttpGet]
        [Route("GetMyBlockedTusers/{tid:int}")]
        public IHttpActionResult GetMyBlockedTusers(HttpRequestMessage request, int tid)
        {

            var myUsers = (from u in _userRepository.GetAll().AsQueryable()
                               //  where(u.id== tid && u.is_tenant==false)
                           select new
                           {
                               id = u.id,
                               tenant_id = u.tenant_id,
                               userid = u.userid,
                               email = u.email,
                               IsLocked = u.is_locked,
                               IsTenant = u.is_tenant,
                               DateCreated = u.date_created,
                               DateModified = u.date_modified
                           }).Where(x => x.tenant_id == tid && x.IsTenant == false);

            return Ok(myUsers);


        }

        [Route("GetAllUsers/{tenantid:int}")]
        public IHttpActionResult GetAllUsers(HttpRequestMessage request, int tenantid)
        {

            var Usersgrid = (from u in _userRepository.GetAll().AsQueryable()
                             join up in _userProfileRepository.GetAll().AsQueryable() on u.userid equals up.userid

                             select new
                             {
                                 tenant_id = u.tenant_id,
                                 id = u.id,
                                 email = u.email,
                                 is_tenant = u.is_tenant,
                                 date_created = u.date_created,
                                 date_modified = u.date_modified,
                                 user_name = up.user_name

                             }).Where(x => x.is_tenant == false);


            return Ok(Usersgrid);

        }
    }
}
