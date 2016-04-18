package com.github.corneil.data_rest_demo.repository;

import com.github.corneil.data_rest_demo.data.GroupInfo;
import com.github.corneil.data_rest_demo.data.GroupMember;
import com.github.corneil.data_rest_demo.data.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceProcessor;

/**
 * Created by Corneil on 2016/04/18.
 */
@Configuration
public class CustomRepositoryConfiguration {
    private static class GroupMemberResourceProcessor implements ResourceProcessor<Resource<GroupMember>> {
        public GroupMemberResourceProcessor(EntityLinks entityLinks) {
            this.entityLinks = entityLinks;
        }
        protected EntityLinks entityLinks;
        @Override
        public Resource<GroupMember> process(Resource<GroupMember> resource) {
            resource.add(entityLinks.linkForSingleResource(GroupInfo.class, resource.getContent().getMemberOfgroup().getId())
                                    .withRel("_memberOfgroup"));
            resource.add(entityLinks.linkForSingleResource(UserInfo.class, resource.getContent().getMember().getId()).withRel("_member"));
            return resource;
        }
    }
    @Bean
    @Autowired
    public ResourceProcessor<Resource<GroupMember>> memberProcessor(EntityLinks entityLinks) {
        return new GroupMemberResourceProcessor(entityLinks);
    }
}
