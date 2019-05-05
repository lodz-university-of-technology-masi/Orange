package pl.masi.enums;

import java.util.HashMap;
import java.util.Map;

public class PermissionType {

    public enum PermissionTypeEnum {
        CANDIDATE, EDITOR, MODERATOR
    }
    public static Map<PermissionTypeEnum, String> permissionTypeMap = new HashMap<PermissionTypeEnum, String>(){
        {
            put(PermissionTypeEnum.MODERATOR, "MODERATOR");
            put(PermissionTypeEnum.EDITOR, "EDITOR");
            put(PermissionTypeEnum.CANDIDATE, "CANDIDATE");
        }
    };

}

