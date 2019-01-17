const CreateGuid = () => {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

export class Group {
    constructor(name, initials = null, parent = null, id = null, synonymous = null, measureUnit = null) {
        this.Id = id ? id : CreateGuid();
        this.Name =  this.getName(name);
        this.Initials =  initials ? initials : this.getInitial(name);
        this.Parent =  parent
        this.ParentId = parent ? parent.Id : null
        // this.Synonymous =  synonymous
        // this.Synonymous_Id = synonymous ? synonymous.Id : null
        this.MeasureUnit = measureUnit ? measureUnit : null
    }

    getName(name) {
        let initialsIndexStart = name.indexOf('(')

        if(initialsIndexStart === -1){
            return name;
        } else {
            return name.substr(0, initialsIndexStart).trim();
        }
    }

    getInitial(name){
        let initialsIndexStart = name.indexOf('(')
        let initialsIndexEnd = name.indexOf(')')

        if(initialsIndexStart === -1) {
            return null;
        }

        if(initialsIndexEnd === -1) {
            return name.substr(initialsIndexStart + 1).trim()
        } else {
            return name.substr(initialsIndexStart + 1, initialsIndexEnd - initialsIndexStart - 1).trim()
        }
    }

    newChild(name, initials = null, id = null, synonymous = null) {
        return new Group(name, initials, this, id, synonymous);
    }

    addChild(group) {

        let last = group;

        while(last.Parent){
            last = last.Parent;
        }

        last.ParentId = this.id;
        return group;
    }

    // lastParent() {
    //     let last = this;

    //     while(last.Parent){
    //         last = last.Parent;
    //     }

    //     return last;
    // }

    revert() {
        let next = this;
        let reverted = this.clone();

        while(next.Parent){
            next = next.Parent;
            reverted.addGroup()
        }

    }
}

export function groupExtensions(prototype) {
    // prototype.addGroup = function(name, initials = null, parent = null, id = null, synonymous = null) { 
    //     this.Group = new Group(name, initials, parent = null, id = null, synonymous = null);
    //     this.Group_Id = this.Group.Id;
    // }
    prototype.addGroup = function(existentGroups = null, newGroups = null, measureUnit = null) {
        if (existentGroups && newGroups) {
            // existentGroups.addChild(newGroups);
            let last = newGroups;

            while(last.Parent) {
                last = last.Parent;
            }
    
            last.ParentId = existentGroups.Id;
        }

        if(existentGroups.isNew) {
            let group = existentGroups

            if(newGroups) {
                group = existentGroups.addChild(newGroups)
            }

            group.MeasureUnit = measureUnit;
            this.Group = group;
            this.GroupId = group.Id;
        } else {
            if(newGroups) {
                newGroups.ParentId = existentGroups.Id;
                newGroups.MeasureUnit = measureUnit;
                this.Group = newGroups;
                this.GroupId = newGroups.Id
            } else if(existentGroups) {
                this.Group = null;
                this.GroupId = existentGroups.Id;
            } else {
                this.Group = null;
                this.GroupId = null;
            }
        }

        if(this.Group) {
            this.Group.MeasureUnit = measureUnit;
            delete this.Group['isNew'];
            let parentGroup = this.Group.Parent
            while(parentGroup) {
                delete parentGroup['isNew'];
                parentGroup = parentGroup.Parent
            }
        }

    }
}

export function examExtensions(prototype){
    prototype.addExam = function(name, initials, collectionDate, value) { 
        this.Exam = new Exam(name, initials, collectionDate, value)
        this.Exam_Name = this.Exam.Name;
        this.Exam_CollectionDate = this.Exam.CollectionDate;
    }
    prototype.addExam = function(exam) { 
        this.Exam = exam
        this.Exam_Name = this.Exam.Name;
        this.Exam_CollectionDate = this.Exam.CollectionDate;
    }
}

export class Exam {
    constructor(collectionDate, value) {
        this.CollectionDate =  collectionDate;
        // this.Value =  value;
    }
}

export class ExamString extends Exam {
    constructor(collectionDate, value) {
        super(collectionDate, value);

        this["@odata.type"] = "#Data.Models.ExamString";
        this.StringValue =  value;
    }

    addLimit(expected, color){
        let limit = {
            GroupId: this.GroupId,
            CollectionDate: this.CollectionDate,
            Color: color,
            Name: expected
        }

        this.LimitDenormalized =  limit;
    }
}

export class MeasureUnit {
    constructor(name) {
        this.Name = name;
    }
}

export class ExamDecimal extends Exam {
    constructor(collectionDate, value) {
        super(collectionDate, value);

        this["@odata.type"] = "#Data.Models.ExamDecimal";
        this.DecimalValue =  parseFloat(value);
    }

    addLimit(description, minType, min, maxType, max, color) {

        let limit = {
            GroupId: this.GroupId,
            CollectionDate: this.CollectionDate,
            MinType: minType,
            Min: parseFloat(min),
            MaxType: maxType,
            Max: parseFloat(max),
            Color: color ? parseInt(color, 16) : null,
            Name: description
        }

        this.LimitDenormalized =  limit;
    }
}

