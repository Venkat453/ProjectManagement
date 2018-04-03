using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Web.Models;
using Projects.Entities.Projects;
using Projects.Data.Repositories;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class LabourEntityExtensions
    {
        public static void AddLabour(this tbl_labour labour, LabourViewModel labourVm)
        {
            labour.tenant_id = labourVm.tenant_id;
            labour.project_id = labourVm.project_id;
            labour.subcontractor_id = labourVm.subcontractor_id;
            labour.name = labourVm.name;
            labour.fathers_name = labourVm.fathers_name;
            labour.gender = labourVm.gender;
            labour.age = labourVm.age;
            labour.blood_group = labourVm.blood_group;
            labour.mother_tongue = labourVm.mother_tongue;

            labour.current_street = labourVm.current_street;
            labour.current_state = labourVm.current_state;
            labour.current_country = labourVm.current_country;
            labour.current_city = labourVm.current_city;
            labour.current_zip = labourVm.current_zip;
            labour.current_contact_number = labourVm.current_contact_number;

            labour.permanent_street = labourVm.permanent_street;
            labour.permanent_country = labourVm.permanent_country;
            labour.permanent_state = labourVm.permanent_state;
            labour.permanent_city = labourVm.permanent_city;
            labour.permanent_zip = labourVm.permanent_zip;
            labour.permanent_contact_number = labourVm.permanent_contact_number;

            labour.contact_person_name = labourVm.contact_person_name;
            labour.contact_person_relationship_id = labourVm.contact_person_relationship_id;
            labour.contact_person_street = labourVm.contact_person_street;
            labour.contact_person_country = labourVm.contact_person_country;
            labour.contact_person_state = labourVm.contact_person_state;
            labour.contact_person_city = labourVm.contact_person_city;
            labour.contact_person_zip = labourVm.contact_person_zip;
            labour.contact_person_contact_number = labourVm.contact_person_contact_number;

            labour.bank_name = labourVm.bank_name;
            labour.bank_account_no = labourVm.bank_account_no;
            labour.bank_branch = labourVm.bank_branch;
            labour.ifsc = labourVm.ifsc;
            labour.pan = labourVm.pan;
            labour.aadhar = labourVm.aadhar;
            labour.epf_no = labourVm.epf_no;
            labour.esi_no = labourVm.esi_no;

            labour.labour_photo = labourVm.labour_photo;
            labour.labour_photo_file_type = labourVm.labour_photo_file_type;
            labour.labour_filename = labourVm.labour_filename;

            labour.check_aadhar = labourVm.check_aadhar;
            labour.aadhar_encode = labourVm.aadhar_encode;
            labour.aadhar_encode_file_type = labourVm.aadhar_encode_file_type;
            labour.aadhar_filename = labourVm.aadhar_filename;

            labour.check_bank = labourVm.check_bank;
            labour.bank_encode = labourVm.bank_encode;
            labour.bank_encode_file_type = labourVm.bank_encode_file_type;
            labour.bank_filename = labourVm.bank_filename;

            labour.check_medical_certificate = labourVm.check_medical_certificate;
            labour.medical_certificate_encode = labourVm.medical_certificate_encode;
            labour.medical_certificate_encode_file_type = labourVm.medical_certificate_encode_file_type;
            labour.medical_filename = labourVm.medical_filename;

            labour.check_eye_certificate = labourVm.check_eye_certificate;
            labour.eye_certificate_encode = labourVm.eye_certificate_encode;
            labour.eye_certificate_encode_file_type = labourVm.eye_certificate_encode_file_type;
            labour.eye_certificate_filenmae = labourVm.eye_certificate_filenmae;

            labour.created_date = DateTime.Now;
            labour.created_by = labourVm.created_by;
            labour.modified_date = DateTime.Now;
            labour.modified_by = labourVm.modified_by;
        }
    }
}