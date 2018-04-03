using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/UserProfile")]
    public class UserProfileController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_users_profiles> _userProfileRepository;

        public UserProfileController(IEntityBaseRepository<tbl_users_profiles> userProfileRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _userProfileRepository = userProfileRepository;
        }

        [HttpGet]
        [Route("UserProfileList/{username}")]
        public HttpResponseMessage UserProfileList(HttpRequestMessage request, string username)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var userProfileList = _userProfileRepository.GetAll().Where(x => x.user_name == username);
                IEnumerable<UserProfileViewModel> userProfilevm = Mapper.Map<IEnumerable<tbl_users_profiles>, IEnumerable<UserProfileViewModel>>(userProfileList);
                response = request.CreateResponse<IEnumerable<UserProfileViewModel>>(HttpStatusCode.OK, userProfilevm);
                return response;
            });
        }



        [HttpPost]
        [Route("SaveUserProfile")]
        public HttpResponseMessage SaveUserProfile(HttpRequestMessage request, UserProfileViewModel userprofile)
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
                    tbl_users_profiles newUserProfile = new tbl_users_profiles();
                    newUserProfile.tenant_id = userprofile.tenant_id;
                    newUserProfile.userid = userprofile.userid;
                    newUserProfile.user_name = userprofile.user_name;
                    newUserProfile.email = userprofile.email;
                    newUserProfile.logo = userprofile.logo;
                    newUserProfile.logo_image_type = userprofile.logo_image_type;
                    newUserProfile.domain = userprofile.domain;
                    _userProfileRepository.Add(newUserProfile);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<UserProfileViewModel>(HttpStatusCode.Created, userprofile);
                }
                return response;
            });
        }

        [HttpPost]
        [Route("updateUserProfile")]
        public HttpResponseMessage updateUserProfile(HttpRequestMessage request, UserProfileViewModel userprofile)
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
                    var existingUserProfile = _userProfileRepository.GetSingle(userprofile.id);
                    if (existingUserProfile != null)
                    {
                        existingUserProfile.userid = userprofile.userid;
                        existingUserProfile.user_name = userprofile.user_name;
                        existingUserProfile.logo = userprofile.logo;
                        existingUserProfile.logo_image_type = userprofile.logo_image_type;
                        existingUserProfile.contact_no = userprofile.contact_no;
                        existingUserProfile.alt_contact_no = userprofile.alt_contact_no;
                        existingUserProfile.domain = userprofile.domain;

                        _userProfileRepository.Edit(existingUserProfile);

                    }
                    else
                    {
                        tbl_users_profiles newUserProfile = new tbl_users_profiles();
                        newUserProfile.tenant_id = userprofile.tenant_id;
                        newUserProfile.userid = userprofile.userid;
                        newUserProfile.user_name = userprofile.user_name;
                        newUserProfile.email = userprofile.email;
                        newUserProfile.logo = userprofile.logo;
                        newUserProfile.logo_image_type = userprofile.logo_image_type;
                        newUserProfile.domain = userprofile.domain;

                        _userProfileRepository.Add(newUserProfile);

                        
                    }
                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }
    }

}