using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
//using Projects.Entities.Projects;
using Projects.Web.Models;
using Projects.Web.Infrastructure.Core;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure;
using Projects.Services;
using System.Data.Entity.Infrastructure;
using System.Web;
using Projects.Data;
using System.Xml;
using System.Data;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/LoginTrack")]
    public class LoginTrackController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_login_track> _logintrackRepository;
        public readonly IEntityBaseRepository<tbl_user> _userRepository;

        public LoginTrackController(IEntityBaseRepository<tbl_login_track> logintrackRepository,
            IEntityBaseRepository<tbl_user> userRepository,
            IEntityBaseRepository<tbl_error> _errorReposity,
            IUnitOfWork _iUnitOfWork) : base(_errorReposity, _iUnitOfWork)
        {
            _logintrackRepository = logintrackRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        [Route("TrackLogin")]
        public HttpResponseMessage TrackLogin(HttpRequestMessage request, LoginTrackViewModel logintrackVM)
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
                    string  vIP = Library.HostAndIP.GetIP();
                    string vlocation = Library.HostAndIP.GetIPLocation(vIP);

                    var newlogintrack = new tbl_login_track()
                    {
                        tenant_key = GlobalVars.gvTenantKey,
                        user_id = GlobalVars.gvUserID,
                        login_time = DateTime.Now,
                        login_ip = vIP,
                        location = vlocation
                    };


                    _logintrackRepository.Add(newlogintrack);
                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }

                return response;
            });
        }

        [Route("GetLoginTrack")]
        public IHttpActionResult GetLoginTrack(HttpRequestMessage request)
        {
            var loginlog = from l in _logintrackRepository.GetAll().AsQueryable()
                      join u in _userRepository.GetAll().AsQueryable() on l.user_id equals u.id
                      orderby(l.login_time)
                      select new
                      {
                          tenant_key = l.tenant_key,
                          user_name = u.user_name,
                          login_time = l.login_time,
                          login_ip = l.login_ip,
                          location = l.location
                      };

            return Ok(loginlog);
        }
    }
}