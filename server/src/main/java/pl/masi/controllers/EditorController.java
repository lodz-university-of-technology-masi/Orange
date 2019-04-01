package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.AccountBean;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IEditorService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value="/editor")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EditorController {

    private final IEditorService editorService;

    @GetMapping(value = "")
    public List<AccountBean> getEditors(){
        return editorService.getAll();
    }

    @ExceptionHandler({Exception.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
