package pl.masi.services.interfaces;

import pl.masi.beans.ChoiceBean;
import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface IChoiceService {
    void createChoice(ChoiceBean choiceBean);
    void updateChoice(Long id, String content);
    void deleteChoice(Long id);
}
